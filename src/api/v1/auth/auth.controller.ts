import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { UserType, UserStatus, OrgStatus } from "../../../common/constants";
import { makeHash } from "../../../common/helper/crypto.helper";
import { createJWT, encode, decode } from "../../../common/helper/jwt.helper";
import { validateBody } from "../../../common/helper/validate.helper";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import {
  sendResetPasswordMail,
  sendVerificationMail
} from "../../../utils/mailer";
import {
  passwordGenerator,
  verificationCodeGenerator
} from "../../../utils/random";
import {
  getRedisValueByKey,
  setRedisValueByKey,
  setRedisValueByKeyWithExpireSec
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
  RegisterUserDto
} from "./dto/request.dto";

const router = Router();

interface MulterRequest extends Request {
  file: any;
  image: any;
}

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
      request.body.email
    );

    let result;

    if (userType === UserType.INDIVIDUAL) {
      result = await authService.loginUser(loginDto);
    } else {
      result = await authService.loginOrg(loginDto);
    }

    await userTokenService.createOrUpdate({
      userId:
        userType === UserType.INDIVIDUAL ? result.user._id : result.org._id,
      userType,
      refreshToken: result.token.refreshToken
    });

    // if user email is not verified, create verification code and send email
    if (!result.user.constant.isEmailVerified) {
      const key = `verification_${userType === UserType.INDIVIDUAL
        ? result.user._id
        : result.org._id}`;
      let code = await getRedisValueByKey(key);
      if (!code) {
        // generate Verification code
        code = verificationCodeGenerator();
        // save code into redis with key
        await setRedisValueByKeyWithExpireSec(key, code, 60 * 30);
      }

      // send Email with Verification code
      sendVerificationMail(
        userType === UserType.INDIVIDUAL ? result.user.email : result.org.email,
        code
      );
    }

    return response.status(200).json({ data: result });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

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
      refreshToken: token.refreshToken
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
        60 * 30
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
        60 * 30
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

router.post(
  "/edit-profile",
  jwtMiddleware.verifyToken,
  uploadFile("images").single("image"),
  async (request: MulterRequest, response: Response) => {
    try {
      console.log("edit profile 11");
      const { id, userType } = request["user"];
      const data = { ...JSON.parse(request.body.data) };
      console.log("edit profile 22");
      const file = request.file;
      if (file) {
        if (userType === UserType.INDIVIDUAL) {
          data.profileUrl = file.location;
        }
      }
      console.log("edit profile 33");
      if (data.email) {
        throw "Email cannot be changed";
      }
      if (data.nickname) {
        const { duplicated } = await authService.checkNickName(data.nickname);
        if (duplicated) throw "Nickname Exists";
      }
      if (data.password) {
        const valid = validatePassword(data.password);
        if (!valid) throw "Invalid Password";
        data.password = await makeHash(data.password);
      }
      console.log("edit profile 44");
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
          data.bankDetail = { ...user.bankDetail, ...data.bankDetail };
        }
        updatedUser = await orgsService.updateOrg(id, data);
      }
      console.log("edit profile 55");
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

      const userType = await authService.checkUserTypeOnLoginByEmail(email);

      let user;
      let updatedUser;

      if (userType === UserType.INDIVIDUAL) {
        user = await userService.getUserByEmail(email);
        updatedUser = await userService.updateUser(user._id, {
          password: _newPasswordHash
        });
      } else {
        user = await orgsService.getOrgByEmail(email);
        updatedUser = await orgsService.updateOrg(user._id, {
          password: _newPasswordHash
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

      const codeFromRedis = await getRedisValueByKey(`verification_${id}`);
      if (!codeFromRedis) throw "Timeout";

      const valid = code === codeFromRedis;
      if (!valid) throw "Invalid verification code";

      let updatedUser;
      if (userType === UserType.INDIVIDUAL) {
        const { constant } = await userService.getUserById(id);
        updatedUser = await userService.updateUser(id, {
          constant: { ...constant, isEmailVerified: true }
        });
      } else {
        const { constant } = await orgsService.getOrgById(id);
        updatedUser = await orgsService.updateOrg(id, {
          constant: { ...constant, isEmailVerified: true }
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
      const result = await authService.checkNickName(request.query.nickname);
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
      return response.status(200).json({ data: { info, pgSummary, userType } });
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
          deletedAt: new Date().toISOString()
        });
      } else {
        updatedUser = await orgsService.updateOrg(id, {
          status: OrgStatus.DELETED,
          deletedAt: new Date().toISOString()
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
