import axios from "axios";
import { Request, Router, Response } from "express";
import KasWallet from "../../../utils/kasWallet";

const router = Router();

// get nft detail
router.get("/", async (request: Request, response: Response) => {
  try {
    const { token_id } = request.query;
    const nftDetail = await KasWallet.getNftDetail(token_id);
    const res = await axios.get(nftDetail.tokenUri);
    return response.status(200).json({
      data: { ...nftDetail, metadata: res.data }
    });
  } catch (error) {
    return response.status(400).json({
      error
    });
  }
});

export default router;
