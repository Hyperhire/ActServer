import { DonationModel } from "../donation/schema/donation.schema";
import { OrderModel } from "./schema/order.schema"

const createOrder = async (orderData) => {
    try {
        const newOrder = await OrderModel.create(
            orderData
        )

        const donation = await DonationModel.findOne({
            _id: orderData.donationId
        })

        return {order: newOrder, donation};
    } catch (error) {
        throw error
    }
}

const updateOrder = async (id, updateData) => {
    try {
        const updatedOrder = await OrderModel.findOneAndUpdate(
            { _id: id},
            updateData,
            {
                new: true
            }
        )

        return updatedOrder;
    } catch (error) {
        throw error
    }
}

const getOrderAndDonation = async (orderId) => {
    try {
        const order = await OrderModel.findOne(
            { _id: orderId},
        );

        const donation = await DonationModel.findOne({_id: order.donationId })

        return { order, donation };
    } catch (error) {
        throw error
    }
}

export default { createOrder, updateOrder, getOrderAndDonation }