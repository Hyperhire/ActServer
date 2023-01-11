import orderService from "../api/v1/order/order.service";
import userService from "../api/v1/user/user.service";
import { PaymentGateway } from "../common/constants";
import { config } from "./../config/config";
import { OrderPaymentType } from "./../common/constants";

const CaverExtKAS = require("caver-js-ext-kas");

const caver = new CaverExtKAS();
caver.initWalletAPI(
  config.KAS_CHAIN_ID,
  config.KAS_ACCESS_KEY,
  config.KAS_SECRET_ACCESS_KEY
);
caver.initMetadataAPI(
  config.KAS_CHAIN_ID,
  config.KAS_ACCESS_KEY,
  config.KAS_SECRET_ACCESS_KEY
);
caver.initKIP17API(
  config.KAS_CHAIN_ID,
  config.KAS_ACCESS_KEY,
  config.KAS_SECRET_ACCESS_KEY,
  2
);

const createWallet = async () => {
  return await caver.kas.wallet.createAccount();
};

const registerNftImage = async file => {
  try {
    const result = await caver.kas.metadata.uploadAsset(
      file
      // config.KAS_STORAGE_KRN
    );
    return result;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

const createMetadata = async order => {
  try {
    const { pg, paymentType, amount, userId } = order;
    const org = await orderService.getOrgInfoByOrder(order);
    const user = await userService.getUserById(userId);

    // TODO: metadata 체크해야함
    const metadata = {
      name: "ACT 기부영수증",
      description: "따뜻한 세상을 향한 움직임, 블록체인 기부플랫폼 ACT.",
      image: org.nftImageUrl,
      external_url: "https://doact.co.kr",
      attributes: [
        {
          trait_type: "후원방식",
          value:
            paymentType === OrderPaymentType.SUBSCRIPTION_PAYMENT
              ? "정기후원"
              : "일시후원"
        },
        {
          trait_type: "단체명",
          value: org.name
        },
        {
          trait_type: "금액",
          value: amount.toLocaleString()
        },
        {
          trait_type: "결제방법",
          value: pg === PaymentGateway.KAKAO ? "카카오페이" : "네이버페이"
        },
        {
          display_type: "date",
          trait_type: "birthday",
          value: user.indInfo.dateOfBirth || "-"
        }
      ]
    };

    const result = await caver.kas.metadata.uploadMetadata(
      metadata,
      config.KAS_STORAGE_KRN
    );
    
    return result;
  } catch (error) {
    return error;
  }
};

const mintNft = async (order, userWallet) => {
  try {
    const token_id = new Date().getTime();
    const { uri: metadataUri } = await createMetadata(order);
    const receipt = await caver.kas.kip17.mint(
      config.KAS_NFT_CONTRACT_ADDRESS,
      userWallet,
      token_id,
      metadataUri
    );
    return { ...receipt, token_id };
  } catch (error) {
    return error;
  }
};

const getNftDetail = async token_id => {
  try {
    const data = await caver.kas.kip17.getToken(
      config.KAS_NFT_CONTRACT_ADDRESS,
      token_id
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const KasWallet = {
  createWallet,
  registerNftImage,
  createMetadata,
  mintNft,
  getNftDetail
};

export default KasWallet;
