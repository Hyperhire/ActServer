import { makeHash } from "../../../common/helper/crypto.helper";
import { AdminModel } from "./schema/admin.schema";

const createAdmin = async (id:string, password:string) => {
  try {
    const passwordHash = await makeHash(password);
    password = passwordHash;

    const admin = await AdminModel.create({
        id,
        password
    });

    return admin;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id: string) => {
    try {
      const admin = await AdminModel.findOne({
        id
      }).lean();
      return admin;
    } catch (error) {
      throw error;
    }
  };

export default {
  createAdmin,
  getUserById
};
