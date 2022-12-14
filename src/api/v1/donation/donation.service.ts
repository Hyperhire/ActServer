import { DonationModel } from "./schema/donation.schema"

const createDonation = async (donationData) => {
    try {
        const newDonation = await DonationModel.create(
            donationData
        )
        return newDonation;
    } catch (error) {
        throw error
    }
}

const getMy = async (userId) => {
    try {
        const donations = await DonationModel.find({ userId }).sort({ createdAt: -1})
        return donations;
    } catch (error) {
        throw error
    }
}

export default { createDonation, getMy }