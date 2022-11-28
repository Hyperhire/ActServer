import { createHmac } from "crypto"
import { config } from "src/config/config"

const makeHash = async (password: string): Promise<string> => {
    try {
        const hash = createHmac('sha256', config.hashKey)
        const update = hash.update(password)
        const digest = update.digest("hex")
        return digest
    } catch (error) {
        return error
    }

}


export { makeHash }