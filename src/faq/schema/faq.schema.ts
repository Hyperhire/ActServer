import { Schema, model, Types } from 'mongoose'
import { ModelNames } from '../../common/constants/model.constants'

interface FAQ {
    question: string,
    answer: string,
    createdAt: Date,
    updatedAt: Date
}

const schema = new Schema<FAQ>({
    question: { type: String },
    answer: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})
const FAQModel = model<FAQ>(ModelNames.FAQ, schema)

export { FAQModel }