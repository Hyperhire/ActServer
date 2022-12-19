import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { UserType } from "../../../common/constants";
import { validateBody } from "../../../common/helper/validate.helper";
import { logger } from "../../../logger/winston.logger";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import orgsService from "../orgs/orgs.service";
import userService from "../user/user.service";
import authService from "./auth.service";
import {
  LoginDto,
  QueryDto,
  RegisterOrgDto,
  RegisterUserDto
} from "./dto/request.dto";

const router = Router();

// user login
/*
{
  "email":"conan.kim22@hyperhire.in",
  "password":"hello",
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

    return response.status(201).json({ data: result });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

router.post("/user/login", async (request: Request, response: Response) => {
  try {
    const loginDto = plainToInstance(LoginDto, request.body);
    await validateBody<LoginDto>(loginDto);
    const result = await authService.loginUser(loginDto);
    return response.status(201).json({ data: result });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

// org login
router.post("/org/login", async (request: Request, response: Response) => {
  try {
    const loginDto = plainToInstance(LoginDto, request.body);
    await validateBody<LoginDto>(loginDto);
    const result = await authService.loginOrg(loginDto);
    response.status(201).json({ data: result });
  } catch (error) {
    logger.error(error);
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
router.post("/user/register", async (request: Request, response: Response) => {
  try {
    // const user = plainToInstance(RegisterUserDto, request.body);
    // await validateBody<RegisterUserDto>(user);
    const result = await authService.registerUser(request.body);
    response.status(201).json(result);
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

// org register
router.post("/org/register", async (request: Request, response: Response) => {
  try {
    // const orgDto = plainToInstance(RegisterOrgDto, request.body);
    // await validateBody<LoginDto>(orgDto);
    const result = await authService.registerOrg(request.body);
    response.status(201).json(result);
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

router.get(
  "/check-duplicate-email",
  async (request: Request, response: Response) => {
    try {
      // const queryDto = plainToInstance(QueryDto, request.query);
      // await validateBody<QueryDto>(queryDto);
      const result = await authService.checkEmail(request.query.email);
      response.status(200).json({ data: result });
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
      response.status(200).json({ data: result });
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
      const { id: userId, userType } = request["user"].id;
      let info;
      if (userType === UserType.INDIVIDUAL) {
        info = await userService.getUserById(userId);
      } else {
        info = await orgsService.getOrgById(userId);
      }
      response.status(200).json({ data: info });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

router.get(
  "/user/my",
  jwtMiddleware.verifyToken,
  async (request: Request, response: Response) => {
    try {
      const userId = request["user"].id;
      const user = await userService.getUserById(userId);
      response.status(200).json({ data: user });
    } catch (error) {
      logger.error(error);
      return response.status(400).json({ error });
    }
  }
);

export default router;
