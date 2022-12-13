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

const getAllDonations = async () => {
    try {
        const recurringDonations = await DonationModel.find({isRecurring: true}).sort({ amount: 1})
        const nonRecurringDonations = await DonationModel.find({isRecurring: false}).sort({ amount: 1})
        return {
            recurringDonations,
            nonRecurringDonations
        };
    } catch (error) {
        throw error
    }
}

export default { createDonation, getAllDonations }