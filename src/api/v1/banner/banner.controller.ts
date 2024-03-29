import { Request, Router, Response } from "express";
import bannerService from "./banner.service";

const router = Router();

router.post("/", async (request: Request, response: Response) => {
  try {
    //   console.log("request from get banner", request.params, request.query);
    const newBanner = await bannerService.createBanner(request.body);

    return response.status(201).send({ data: newBanner });
  } catch (error) {
    return response.status(400).send({ error });
  }
});

router.get("/", async (request: Request, response: Response) => {
  try {
    //   console.log("request from get banner", request.params, request.query);
    const banners = await bannerService.getBanners();

    return response.status(200).send({ data: banners });
  } catch (error) {
    return response.status(400).send({ error });
  }
});

router.patch("/:id", async (request: Request, response: Response) => {
  try {
    const bannerId = request.params.id;
    const updateData = request.body;
    const banner = await bannerService.updateBanner(bannerId, updateData);

    return response.status(200).send({ data: banner });
  } catch (error) {
    return response.status(400).send({ error });
  }
});

export default router;
