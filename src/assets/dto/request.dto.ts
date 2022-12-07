import { IsString } from "class-validator";
import { AssetType } from "../schema/assets.schema";

export class CreateAsset {
    @IsString()
    assetType: AssetType
}