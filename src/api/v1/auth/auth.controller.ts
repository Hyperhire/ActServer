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

router.post("/user/login", async (request: Request, response: Response) => {
  try {
    const loginDto = plainToInstance(LoginDto, request.body);
    await validateBody<LoginDto>(loginDto);
    const result = await authService.loginUser(loginDto);
    response.json(result);
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error });
  }
});

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

router.post("/user/register", async (request: Request, response: Response) => {
  try {
    const user = plainToInstance(RegisterUserDto, request.body);
    await validateBody<RegisterUserDto>(user);
    const result = await authService.registerUser(user);
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
