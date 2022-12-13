import { OrderModel } from "./schema/order.schema"

const createOrder = async (orderData) => {
    try {
        const newOrder = await OrderModel.create(
            orderData
        )
        return newOrder;
    } catch (error) {
        throw error
    }
}

export default { createOrder }