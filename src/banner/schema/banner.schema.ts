import { Schema, model } from 'mongoose'
import { ModelNames } from '../../common/constants/model.constants'

interface Banner {
    clickUrl: string,
    imageUrl: string,
    show: boolean
}

const schema = new Schema<Banner>({
    clickUrl: {
        type: String
    },
    imageUrl: {
        type: String
    },
    show: {
        type: Boolean
    }
});

const BannerModel = model<Banner>(ModelNames.Banner, schema)

export { BannerModel }