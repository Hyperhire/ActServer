import { WithdrawModel } from "./schema/withdraw.schema";

const createWithdraw = async data => {
  try {
    const withdraw = await WithdrawModel.create(data);
    return withdraw;
  } catch (error) {
    throw error;
  }
};

export default { createWithdraw };
