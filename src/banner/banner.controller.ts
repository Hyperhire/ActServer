import { Request, Router, Response } from 'express'
import bannerService from './banner.service'

const router = Router()

router.post("/",async (request: Request, response: Response) => { 
    const newBanner = await bannerService.createBanner(request.body)
    
    response.status(201);
    response.send({data:newBanner})
})

router.get("/",async (request: Request, response: Response) => { 
    const banners = await bannerService.getBanners()
    
    response.status(201);
    response.send({data: banners})
})

router.patch("/:id",async (request: Request, response: Response) => { 
    const bannerId = request.params.id;
    const updateData = request.body;
    const banner = await bannerService.updateBanner(bannerId, updateData)
    
    response.status(201);
    response.send({data: banner})
})

export default router
