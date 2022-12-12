import { Request, Router, Response } from "express";

const router = Router();

router.get("/", (request: Request, response: Response) => {
  response.json({
    status: 200,
    data: {
      text: "hello, this is conan from hyperhire",
      timestamp: new Date()
    }
  });
});

export default router;
