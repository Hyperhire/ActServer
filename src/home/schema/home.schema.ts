import { Schema, model } from 'mongoose'
import { ModelNames } from '../../common/constants/model.constants'

export enum WidgetTypes {
    BANNER = "BANNER",
    ORGS = "ORGS",
    CAMPAIGNS = "CAMPAIGNS",
    NOTICES = "NOTICES",
    FAQS = "FAQS",
    STATIC = "STATIC"

}


interface Home {
    banners: string
    orgs: string
    campaigns: string
    notices: string
    faqs: string
    static: string
}




const schema = new Schema<Home>({
    banners: { type: String, enum: WidgetTypes },
    orgs: { type: String, enum: WidgetTypes },
    campaigns: { type: String, enum: WidgetTypes },
    notices: { type: String, enum: WidgetTypes },
    faqs: { type: String, enum: WidgetTypes },
    static: { type: String }

})
const HomeModel = model<Home>(ModelNames.Home, schema)

export { HomeModel, Home as HomeSchema }