import { Request, Router, Response, response } from "express";
import { UserType } from "../../../common/constants";
import { createJWT, decode } from "../../../common/helper/jwt.helper";
import { logger } from "../../../logger/winston.logger";
import authMiddleware from "../../../middleware/auth.middleware";
import jwtMiddleware from "../../../middleware/jwt.middleware";
import authService from "../auth/auth.service";
import userTokenService from "../userToken/userToken.service";

const router = Router();

router.post(
    "/register",
    jwtMiddleware.verifyToken,
    authMiddleware.validOnlyAdmin,
    async (request: Request, response: Response) => {
        try {
            const { id, password } = request.body;
            if (!id || !password) {
                throw "id | password required";
            }

            const result = await authService.registerAdmin(id, password);

            return response.status(201).json({ data: result });
        } catch (error) {
            logger.error(error);
            return response.status(400).json({ error });
        }
    }
);

/**
 * @swagger
 *  /api/v1/auth/login/admin:
 *    post:
 *      tags:
 *      - Auth
 *      description: admin 로그인하기
 *      comsumes:
 *      - application/json
 *      parameters:
 *        - name: id
 *          in: body
 *          required: true
 *          schema:
 *              type: string
 *              example: kim123123
 *          description: ID
 *        - name: password
 *          in: body
 *          required: true
 *          schema:
 *              type: string
 *              example: password123
 *          description: 비밀번호
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
 */
router.post("/login", async (request: Request, response: Response) => {
    try {
        const { id, password } = request.body;

        let result = await authService.loginAdmin(id, password);

        await userTokenService.createOrUpdate({
            userId: result.admin._id,
            userType: UserType.ADMIN,
            refreshToken: result.token.refreshToken,
        });

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

export default router;
