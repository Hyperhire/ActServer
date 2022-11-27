import { Schema, model } from 'mongoose'

interface User {
    name: string,
    email: string,
    nickname: string,
    password: string,
    createdAt: Date,
    updatedAt: Date
}

const schema = new Schema<User>({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    nickname: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})
const UserModel = model<User>("User", schema)

export { UserModel }