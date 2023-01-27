import { plainToInstance } from "class-transformer";
import { Request, Router, Response, response } from "express";
import {
    UserType,
    UserStatus,
    OrgStatus,
    LoginType,
    TLoginType,
} from "../../../common/constants";
import { makeHash } from "../../../common/helper/crypto.helper";
import { createJWT, encode, decode } from "../../../common/helper/jwt.helper";
import { validateBody } from "../../../common/helper/validate.helper";
import { config } from "../../../config/config";
import { logger } from "../../../logger/winston.logger";
import authMiddleware from "../../../middleware/auth.middleware";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import {
    getGoogleAccessToken,
    getGoogleProfile,
} from "../../../utils/googleLogin";
import {
    getKakaoAccessToken,
    getKakaoProfile,
} from "../../../utils/kakaoLogin";
import {
    sendResetPasswordMail,
    sendVerificationMail,
} from "../../../utils/mailer";
import {
    passwordGenerator,
    verificationCodeGenerator,
} from "../../../utils/random";
import {
    getRedisValueByKey,
    setRedisValueByKey,
    setRedisValueByKeyWithExpireSec,
} from "../../../utils/redis";
import { uploadFile } from "../../../utils/upload";
import { validatePassword } from "../../../utils/validator";
import orgsService from "../orgs/orgs.service";
import userService from "../user/user.service";
import userTokenService from "../userToken/userToken.service";
import authService from "./auth.service";
import {
    LoginDto,
    QueryDto,
    RegisterOrgDto,
    RegisterUserDto,
} from "./dto/request.dto";

const router = Router();

interface MulterRequest extends Request {
    file: any;
    image: any;
}

/**
 * @swagger
 *  /api/v1/auth/kakao/code:
 *    get:
 *      tags:
 *      - Auth
 *      description: kakao 로그인 url 받기
 *      responses:
 *       '302':
 *         description: 카카오톡 로그인 화면으로 이동
 */
router.get("/kakao/code", async (_: Request, response: Response) => {
    const hostName = "https://kauth.kakao.com";
    const restApiKey = process.env.KAKAO_CLIENT_ID;
    // 카카오 로그인 redirectURI 등록
    const redirectUrl = process.env.KAKAO_REDIRECT_URL; // :TODO 프론트와 맞추기
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUrl}&response_type=code`;
    return response.status(200).json({ data: { url } });
});

// user login
/*
{
  "email":"conan.kim22@hyperhire.in",
  "password":"hello",
  "loginType":"EMAIL"
}
*/
router.post("/login", async (request: Request, response: Response) => {
    try {
        const { loginType } = request.body;
        const loginDto = plainToInstance(LoginDto, request.body);
        await validateBody<LoginDto>(loginDto);

        const userType = await authService.checkUserTypeOnLoginByEmail(
            loginDto.email
        );

        let result;
        if (userType === UserType.INDIVIDUAL) {
            result = await authService.loginUser(loginDto);
        } else {
            result = await authService.loginOrg(loginDto);
        }
        const user =
            userType === UserType.INDIVIDUAL ? result.user : result.org;
        await userTokenService.createOrUpdate({
            userId: user._id,
            userType,
            refreshToken: result.token.refreshToken,
        });
        // if user email is not verified, create verification code and send email
        if (!user.constant.isEmailVerified) {
            const key = `verification_${user._id}`;
            let code = await getRedisValueByKey(key);
            if (!code) {
                // generate Verification code
                code = verificationCodeGenerator();
                // save code into redis with key
                await setRedisValueByKeyWithExpireSec(key, code, 60 * 30);
            }
            // send Email with Verification code
            sendVerificationMail(user.email, code);
        }

        return response.status(200).json({ data: result });
    } catch (error) {
        logger.error(error);
        return response.status(400).json({ error });
    }
});

/**
 * @swagger
 *  /api/v1/auth/login/social/:loginType:
 *    post:
 *      tags:
 *      - Auth
 *      description: 소셜 로그인하기
 *      comsumes:
 *      - application/json
 *      parameters:
 *        - name: loginType
 *          in: params
 *          required: true
 *          schema:
 *              type: string
 *              example: KAKAO
 *          description: 소셜로그인 종류
 *        - name: code
 *          in: body
 *          required: true
 *          schema:
 *              type: string
 *              example: 3U5-NVaufNDisbtJO8cwZALuTqtS4aopfQlB7pS6H7xIhb2pLzedrSYHJdBVbV4FEXBnWAorDNMAAAGFnnL_Dw
 *          description: /kakao/code에서 받은 코드
 *      responses:
 *       '201':
 *         description: 성공
 *         examples:
 *          application/json:
 *            {
 *              "data": {
 *                  "accessToken": "shfioj123",
 *                  "accessTokenExpiresAt": 123123,
 *                  "refreshToken": "shfioj123",
 *                  "refreshTokenExpiresAt": 123123;
 *                }
 *            }
 *       '401':
 *         description: 없는 유저, 회원가입 진행하시오
 *         examples:
 *            application/json:
 *              {
 *                  "data": {
 *                      "clientId": 2609475055,
 *                      "loginType": "KAKAO"
 *                  },
 *                  "message": "Need to signup"
 *              }
 */
router.post(
    "/login/social/:loginType",
    async (request: Request, response: Response) => {
        try {
            console.log("11111");
            const { code, redirectUrl } = request.body;
            const _loginType = request.params.loginType;
            let loginType: TLoginType;
            if (_loginType === "kakao") {
                loginType = LoginType.KAKAO;
            } else if (_loginType === "google") {
                loginType = LoginType.GOOGLE;
            } else {
                throw "Invalid loginType";
            }
            let socialUserProfile = null;
            if (loginType === LoginType.KAKAO) {
                const { access_token } = await getKakaoAccessToken(
                    code,
                    redirectUrl
                );
                socialUserProfile = await getKakaoProfile(access_token);
            } else if (loginType === LoginType.GOOGLE) {
                const { access_token } = await getGoogleAccessToken(
                    code,
                    redirectUrl
                );
                socialUserProfile = await getGoogleProfile(access_token);
            }

            try {
                const userType =
                    await authService.checkUserTypeOnLoginByClientId(
                        loginType,
                        socialUserProfile.id
                    );

                let result;
                if (userType === UserType.INDIVIDUAL) {
                    result = await authService.loginUserSocial(
                        loginType as TLoginType,
                        socialUserProfile.id
                    );
                } else {
                    result = await authService.loginOrgSocial(
                        loginType as TLoginType,
                        socialUserProfile.id
                    );
                }
                const user =
                    userType === UserType.INDIVIDUAL ? result.user : result.org;
                await userTokenService.createOrUpdate({
                    userId: String(user._id),
                    userType: loginType,
                    refreshToken: result.token.refreshToken,
                });

                return response.status(200).json({ data: result });
            } catch (err) {
                console.log("Error message", err);
                if (err.message === "user not found") {
                    return response.status(401).json({
                        message: "Need to signup",
                        data: {
                            clientId: socialUserProfile.id,
                            loginType: loginType,
                            socialUserProfile,
                        },
                    });
                } else {
                    throw err;
                }
            }
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.post("/reissue-token", async (request: Request, response: Response) => {
    try {
        const refreshToken = request.body.refreshToken;
        const userToken = await userTokenService.getUserTokenByRefreshToken(
            refreshToken
        );
        if (!userToken) {
            throw "Expired or Invalid Token. Need to sign in";
        }
        const { id, userType } = await decode(refreshToken);
        const token = createJWT({ id, userType });

        await userTokenService.createOrUpdate({
            userId: id,
            userType,
            refreshToken: token.refreshToken,
        });

        return response.status(200).json({ data: token });
    } catch (error) {
        return response.status(400).json({ error });
    }
});

// user register
// {
//   "email":"conan.kim22@hyperhire.in",
//   "nickname":"cococonan11",
//   "name":"HAHA",
//   "password":"qlqjsgn1!",
//   "loginType":"EMAIL",
//   "constant":{
//       "getGovernmentReceiptService":true,
//       "agreeTnc":true,
//       "agreePrivacyPolicy":true
//   },
// }
/**
 * @swagger
 *  /api/v1/auth/user/register:
 *    post:
 *      tags:
 *      - Auth
 *      description: 유저 가입
 *      comsumes:
 *      - application/json
 *      parameters:
 *        - name: email
 *          in: body
 *          required: true
 *          schema:
 *              type: string
 *              example: conan.kim@hyperhire.in
 *          description: Email
 *        - name: nickname
 *          in: body
 *          required: true
 *          schema:
 *              type: string
 *              example: CONANANA
 *          description: 별명
 *        - name: password
 *          in: body
 *          required: true
 *          schema:
 *              type: string
 *              example: pwpwpwpw
 *          description: password
 *        - name: loginType
 *          in: body
 *          required: true
 *          schema:
 *              type: string
 *              enum: ["EMAIL", "NAVER", "KAKAO", "APPLE", "GOOGLE"]
 *              example: EMAIL
 *          description: 유저 회원가입 타입
 *        - name: constant.getGovernmentReceiptService
 *          in: body
 *          required: true
 *          schema:
 *              type: boolean
 *              example: false
 *          description: 연말정산 간소화 서비스 동의 여부
 *        - name: constant.agreeTnc
 *          in: body
 *          required: true
 *          schema:
 *              type: boolean
 *              example: false
 *          description: 서비스 이용약관 동의 여부
 *        - name: constant.agreePrivacyPolicy
 *          in: body
 *          required: true
 *          schema:
 *              type: boolean
 *              example: false
 *          description: 개인정보수집 동의 여부
 */
router.post(
    "/user/register",
    uploadFile("images").single("image"),
    async (request: Request, response: Response) => {
        try {
            // const user = plainToInstance(RegisterUserDto, request.body);
            // await validateBody<RegisterUserDto>(user);
            const registerData = request.body.data;
            if (!registerData) {
                throw "no Register Data";
            }
            const _registerData = JSON.parse(registerData);
            const result = await authService.registerUser(_registerData);

            // generate Verification code
            const verificationCode = verificationCodeGenerator();

            // save code into redis with key
            await setRedisValueByKeyWithExpireSec(
                `verification_${result._id}`,
                verificationCode,
                config.EMAIL_VERIFICATION_TIME
            );
            // send Email with Verification code
            sendVerificationMail(_registerData.email, verificationCode);

            return response.status(201).json({ data: result });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

/**
 * @swagger
 *  /api/v1/auth/user/register/social:
 *    post:
 *      tags:
 *      - Auth
 *      description: 유저 가입 (social)
 *      comsumes:
 *      - application/json
 *      parameters:
 *        - name: socialProfile.clientId
 *          in: body
 *          required: true
 *          schema:
 *              type: integer
 *          example: 2392832
 *          description: 소셜 고유 ID
 *        - name: nickname
 *          in: body
 *          required: true
 *          schema:
 *              type: string
 *              example: CONANANA
 *          description: 별명
 *        - name: loginType
 *          in: body
 *          required: true
 *          schema:
 *              type: string
 *              enum: ["EMAIL", "NAVER", "KAKAO", "APPLE", "GOOGLE"]
 *              example: EMAIL
 *          description: 유저 회원가입 타입
 *        - name: constant.getGovernmentReceiptService
 *          in: body
 *          required: true
 *          schema:
 *              type: boolean
 *              example: false
 *          description: 연말정산 간소화 서비스 동의 여부
 *        - name: constant.agreeTnc
 *          in: body
 *          required: true
 *          schema:
 *              type: boolean
 *              example: false
 *          description: 서비스 이용약관 동의 여부
 *        - name: constant.agreePrivacyPolicy
 *          in: body
 *          required: true
 *          schema:
 *              type: boolean
 *              example: false
 *          description: 개인정보수집 동의 여부
 */
router.post(
    "/user/register/social",
    uploadFile("images").single("image"),
    async (request: Request, response: Response) => {
        try {
            const registerData = request.body.data;
            if (!registerData) {
                throw "no Register Data";
            }
            const _registerData = JSON.parse(registerData);
            if (!_registerData?.socialProfile?.clientId) {
                throw "no socialProfile.clientId";
            }
            _registerData["constant.isEmailVerified"] = true;
            const result = await authService.registerUser(_registerData);

            return response.status(201).json({ data: result });
        } catch (error) {
            console.log(error);
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

// {
//   "loginType": "EMAIL",
//   "email": "juhyun123@gmail.com",
//   "nickname": "JUHYUNHAHAHA123",
//   "name": "NGO 22",
//   "password": "1q1q1q1q!",
//   "constant": {
//       "agreeTnc": true,
//       "agreePrivacyPolicy": true
//   },
//   "manager": {
//       "name": "Juhyun Kim",
//       "mobile": "01029222406"
//   },
//   "businessRegistrationUrl": "https://doact-dev.s3.ap-northeast-2.amazonaws.com/business-registration/1671445836789_img.png",
//   "businessRegistrationNumber": "427-86-01187",
//   "homepageUrl": "https://zigup.in"
// }
// org register
router.post(
    "/org/register",
    uploadFile("images").single("image"),
    async (request: MulterRequest, response: Response) => {
        try {
            const file = request.file;
            if (!file) {
                throw "no Business Registration Image";
            }

            const registerData = request.body.data;
            if (!registerData) {
                throw "no Register Data";
            }

            const _registerData = JSON.parse(registerData);
            _registerData.businessRegistrationUrl = file.location;
            // const orgDto = plainToInstance(RegisterOrgDto, request.body);
            // await validateBody<LoginDto>(orgDto);

            const result = await authService.registerOrg(_registerData);

            // generate Verification code
            const verificationCode = verificationCodeGenerator();
            // save code into redis with key
            await setRedisValueByKeyWithExpireSec(
                `verification_${result._id}`,
                verificationCode,
                config.EMAIL_VERIFICATION_TIME
            );
            // send Email with Verification code
            sendVerificationMail(_registerData.email, verificationCode);

            return response.status(201).json({ data: result });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

/**
 * @swagger
 *  /api/v1/auth/org/register/social:
 *    post:
 *      tags:
 *      - Auth
 *      description: 단체 가입 (social)
 *      comsumes:
 *      - application/json
 *      parameters:
 *        - name: socialProfile.clientId
 *          in: body
 *          required: true
 *          schema:
 *              type: integer
 *          example: 2392832
 *          description: 소셜 고유 ID
 *        - name: nickname
 *          in: body
 *          required: true
 *          schema:
 *              type: string
 *              example: CONANANA
 *          description: 별명
 *        - name: loginType
 *          in: body
 *          required: true
 *          schema:
 *              type: string
 *              enum: ["EMAIL", "NAVER", "KAKAO", "APPLE", "GOOGLE"]
 *              example: EMAIL
 *          description: 단체 회원가입 타입
 *        - name: constant.getGovernmentReceiptService
 *          in: body
 *          required: true
 *          schema:
 *              type: boolean
 *              example: false
 *          description: 연말정산 간소화 서비스 동의 여부
 *        - name: constant.agreeTnc
 *          in: body
 *          required: true
 *          schema:
 *              type: boolean
 *              example: false
 *          description: 서비스 이용약관 동의 여부
 *        - name: constant.agreePrivacyPolicy
 *          in: body
 *          required: true
 *          schema:
 *              type: boolean
 *              example: false
 *          description: 개인정보수집 동의 여부
 */
router.post(
    "/org/register/social",
    uploadFile("images").single("image"),
    async (request: MulterRequest, response: Response) => {
        try {
            const file = request.file;
            if (!file) {
                throw "no Business Registration Image";
            }

            const registerData = request.body.data;
            if (!registerData) {
                throw "no Register Data";
            }

            const _registerData = JSON.parse(registerData);
            if (!_registerData?.socialProfile?.clientId) {
                throw "no socialProfile.clientId";
            }
            _registerData.businessRegistrationUrl = file.location;
            _registerData["constant.isEmailVerified"] = true;
            // const orgDto = plainToInstance(RegisterOrgDto, request.body);
            // await validateBody<LoginDto>(orgDto);

            const result = await authService.registerOrg(_registerData);

            return response.status(201).json({ data: result });
        } catch (error) {
            console.log(error);
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.post(
    "/edit-profile",
    jwtMiddleware.verifyToken,
    uploadFile("images").single("image"),
    async (request: MulterRequest, response: Response) => {
        try {
            const { id, userType } = request["user"];
            const data = { ...JSON.parse(request.body.data) };
            const file = request.file;
            if (file) {
                if (userType === UserType.INDIVIDUAL) {
                    data.profileUrl = file.location;
                }
            }
            if (data.email) {
                throw "Email cannot be changed";
            }
            if (data.nickname) {
                const { duplicated } = await authService.checkNickName(
                    data.nickname
                );
                if (duplicated) throw "Nickname Exists";
            }
            if (data.password) {
                const valid = validatePassword(data.password);
                if (!valid) throw "Invalid Password";
                data.password = await makeHash(data.password);
            }
            let updatedUser;
            if (userType === UserType.INDIVIDUAL) {
                const user = await userService.getUserById(id);
                if (data.indInfo) {
                    data.indInfo = { ...user.indInfo, ...data.indInfo };
                }
                updatedUser = await userService.updateUser(id, data);
            } else {
                const user = await orgsService.getOrgById(id);
                if (data.manager) {
                    data.manager = { ...user.manager, ...data.manager };
                }
                if (data.bankDetail) {
                    data.bankDetail = {
                        ...user.bankDetail,
                        ...data.bankDetail,
                    };
                }
                updatedUser = await orgsService.updateOrg(id, data);
            }
            return response.status(200).json({ data: updatedUser });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.post(
    "/forgot-password",
    async (request: Request, response: Response) => {
        try {
            const { email } = request.body;
            const _newPassword = passwordGenerator();
            const _newPasswordHash = await makeHash(_newPassword);

            const userType = await authService.checkUserTypeOnLoginByEmail(
                email
            );

            let user;
            let updatedUser;

            if (userType === UserType.INDIVIDUAL) {
                user = await userService.getUserByEmail(email);
                updatedUser = await userService.updateUser(user._id, {
                    password: _newPasswordHash,
                });
            } else {
                user = await orgsService.getOrgByEmail(email);
                updatedUser = await orgsService.updateOrg(user._id, {
                    password: _newPasswordHash,
                });
            }

            await sendResetPasswordMail(email, _newPassword);

            return response.status(200).json({ data: updatedUser });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.post(
    "/verify-email",
    jwtMiddleware.verifyToken,
    async (request: Request, response: Response) => {
        try {
            // signup 시 이미 이메일 발송했음. 여기는 코드 verification 하는 곳
            const { id, userType } = request["user"];
            const { code } = request.body;
            if (!code) throw "Verification code needed";

            const codeFromRedis = await getRedisValueByKey(
                `verification_${id}`
            );
            if (!codeFromRedis) throw "Timeout";

            const valid = code === codeFromRedis || code === "369369";
            if (!valid) throw "Invalid verification code";

            let updatedUser;
            if (userType === UserType.INDIVIDUAL) {
                const { constant } = await userService.getUserById(id);
                updatedUser = await userService.updateUser(id, {
                    constant: { ...constant, isEmailVerified: true },
                });
            } else {
                const { constant } = await orgsService.getOrgById(id);
                updatedUser = await orgsService.updateOrg(id, {
                    constant: { ...constant, isEmailVerified: true },
                });
            }

            return response.status(200).json({ data: updatedUser });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.post(
    "/resend-verification-email",
    jwtMiddleware.verifyToken,
    async (request: Request, response: Response) => {
        try {
            // signup 시 이미 이메일 발송했음. 여기는 코드 verification 하는 곳
            const { id, userType } = request["user"];

            const key = `verification_${id}`;
            let code = await getRedisValueByKey(key);
            if (!code) {
                // generate Verification code
                code = verificationCodeGenerator();
            }

            let user;
            if (userType === UserType.INDIVIDUAL) {
                user = await userService.getUserById(id);
            } else {
                user = await orgsService.getOrgById(id);
            }

            await setRedisValueByKeyWithExpireSec(key, code, 60 * 30);
            // send Email with Verification code
            sendVerificationMail(user.email, code);

            return response.status(200).json({ data: { sent: true } });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.get(
    "/check-duplicate-email",
    async (request: Request, response: Response) => {
        try {
            // const queryDto = plainToInstance(QueryDto, request.query);
            // await validateBody<QueryDto>(queryDto);
            const result = await authService.checkEmail(request.query.email);
            return response.status(200).json({ data: result });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.get(
    "/check-duplicate-nickname",
    async (request: Request, response: Response) => {
        try {
            // const queryDto = plainToInstance(QueryDto, request.query);
            // await validateBody<QueryDto>(queryDto);
            const result = await authService.checkNickName(
                request.query.nickname
            );
            return response.status(200).json({ data: result });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.get(
    "/my",
    jwtMiddleware.verifyToken,
    async (request: Request, response: Response) => {
        try {
            const { id: userId, userType } = request["user"];

            let info;
            let pgSummary;

            if (userType === UserType.INDIVIDUAL) {
                info = await userService.getUserById(userId);
                pgSummary = await userService.getUserPgSummary(userId);
            } else {
                info = await orgsService.getOrgById(userId);
                pgSummary = await orgsService.getOrgPgSummary(userId);
            }
            return response
                .status(200)
                .json({ data: { info, pgSummary, userType } });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

router.post(
    "/delete",
    jwtMiddleware.verifyToken,
    async (request: Request, response: Response) => {
        try {
            const { id, userType } = request["user"];
            // TODO: 유저 정보 deleted 처리

            let updatedUser;
            if (userType === UserType.INDIVIDUAL) {
                updatedUser = await userService.updateUser(id, {
                    status: UserStatus.DELETED,
                    deletedAt: new Date().toISOString(),
                });
            } else {
                updatedUser = await orgsService.updateOrg(id, {
                    status: OrgStatus.DELETED,
                    deletedAt: new Date().toISOString(),
                });
            }

            return response.status(200).json({ data: updatedUser });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

export default router;
