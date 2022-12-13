import { Schema, model, Types } from 'mongoose'
import { ModelNames } from '../../../../common/constants/model.constants'

interface UserSettings {
    user_id: Types.ObjectId
    receiveReceipt: boolean
}

const schema = new Schema<UserSettings>({
    user_id: { type: Schema.Types.ObjectId, ref: ModelNames.User },
    receiveReceipt: { type: Boolean }
})
const UserSettingsModel = model<UserSettings>(ModelNames.UserSettings, schema)

export { UserSettingsModel }