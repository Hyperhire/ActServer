import { plainToInstance } from "class-transformer";
import { Request, Router, Response } from "express";
import { validateBody } from "../../../common/helper/validate.helper";
import { logger } from "../../../logger/winston.logger";
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
    response.json(result);
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

// user register
/*
{
    "email":"conan.kim22@hyperhire.in",
    "nickname":"cococonan11",
    "name":"HAHA",
    "password":"qlqjsgn1!",
    "loginType":"EMAIL",
    "constant":{
        "getGovernmentReceiptService":true,
        "isEmailVerified":true,
        "agreeTnc":true,
        "agreePrivacyPolicy":true
    },
    "indInfo":{
        "name":"김주현현",
        "mobile":"01029222406",
        "dateOfBirth":"2022-12-12T17:14:18.446+00:00"
    }
}
*/
router.post("/user/register", async (request: Request, response: Response) => {
  try {
    // const user = plainToInstance(RegisterUserDto, request.body);
    // await validateBody<RegisterUserDto>(user);
    const result = await authService.registerUser(request.body);
    response.json(result);
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

// org register
router.post("/org/register", async (request: Request, response: Response) => {
  try {
    const orgDto = plainToInstance(RegisterOrgDto, request.body);
    await validateBody<LoginDto>(orgDto);
    const result = await authService.registerOrg(orgDto);
    response.json(result);
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

router.get("/user", async (request: Request, response: Response) => {
  try {
    const queryDto = plainToInstance(QueryDto, request.query);
    await validateBody<QueryDto>(queryDto);
    const result = await authService.checkUserNickName(queryDto);
    response.json(result);
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

router.get("/org", async (request: Request, response: Response) => {
  try {
    const queryDto = plainToInstance(QueryDto, request.query);
    await validateBody<QueryDto>(queryDto);
    const result = await authService.checkOrgNickName(queryDto);
    response.json(result);
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

export default router;
