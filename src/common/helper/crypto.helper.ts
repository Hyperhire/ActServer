import { createHmac, timingSafeEqual } from "crypto"
import { config } from "../../config/config"

const makeHash = async (password: string): Promise<string> => {
    try {
        const hash = createHmac('sha256', config.hashKey)
        const update = hash.update(password)
        const digest = update.digest("hex")
        return digest
    } catch (error) {
        throw error
    }

}

const compareHash = async (password: string, hash: string) => {
    try {
        const buffPassword = Buffer.from(await makeHash(password))
        const buffHash = Buffer.from(hash)
        return timingSafeEqual(buffPassword, buffHash)
    } catch (error) {
        throw error
    }
}

export { makeHash, compareHash }