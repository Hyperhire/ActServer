import orderService from "../api/v1/order/order.service";

const CaverExtKAS = require("caver-js-ext-kas");

const caver = new CaverExtKAS();
caver.initWalletAPI(
  process.env.KAS_CHAIN_ID,
  process.env.KAS_ACCESS_KEY,
  process.env.KAS_SECRET_ACCESS_KEY
);
caver.initMetadataAPI(
  process.env.KAS_CHAIN_ID,
  process.env.KAS_ACCESS_KEY,
  process.env.KAS_SECRET_ACCESS_KEY
);
caver.initKIP17API(
  process.env.KAS_CHAIN_ID,
  process.env.KAS_ACCESS_KEY,
  process.env.KAS_SECRET_ACCESS_KEY,
  2
);

const hello = () => {
  console.log("hello?");
};

const createWallet = async () => {
  return await caver.kas.wallet.createAccount();
};

const registerNftImage = async file => {
  try {
    console.log("file is", file);
    const result = await caver.kas.metadata.uploadAsset(
      file
      // process.env.KAS_STORAGE_KRN
    );
    return result;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

const createMetadata = async () => {
  try {
    // TODO: image 현재 신규로 들어간 이미지로 고정
    const metadata = {
      name: "ACT 기부영수증 #9982",
      description: "따뜻한 세상을 향한 움직임, 블록체인 기부플랫폼 ACT.",
      image:
        "https://metadata-store.klaytnapi.com/fd2f81df-cfaa-32f4-bbfa-52ad7b378c6f/510703c4-127d-ecfa-d3a0-8065a44c103c.png",
      external_url: "https://cojamact.example",
      attributes: [
        {
          trait_type: "후원방식",
          value: "정기후원"
        },
        {
          trait_type: "단체명",
          value: "홀트아동복지회관"
        },
        {
          trait_type: "금액",
          value: "30,000"
        },
        {
          trait_type: "결제방법",
          value: "에스크로일반"
        },
        {
          display_type: "date",
          trait_type: "birthday",
          value: 1546360800
        }
      ]
    };
    const result = await caver.kas.metadata.uploadMetadata(
      metadata,
      process.env.KAS_STORAGE_KRN
    );
    return result;
  } catch (error) {
    return error;
  }
};

const createMetadataNew = async order => {
  try {
    const { pg, isRecurring, amount } = order;
    const org = await orderService.getOrgInfoByOrder(order);
    const metadata = {
      name: "ACT 기부영수증",
      description: "따뜻한 세상을 향한 움직임, 블록체인 기부플랫폼 ACT.",
      image: org.nftImageUrl,
      external_url: "https://cojamact.example",
      attributes: [
        {
          trait_type: "후원방식",
          value: isRecurring ? "정기후원" : "일시후원"
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
          value: pg === "KAKAO" ? "카카오페이" : "네이버페이"
        },
        {
          display_type: "date",
          trait_type: "birthday",
          value: 1546360800
        }
      ]
    };
    console.log("--- metadata", metadata);
    const result = await caver.kas.metadata.uploadMetadata(
      metadata,
      process.env.KAS_STORAGE_KRN
    );
    return result;
  } catch (error) {
    return error;
  }
};

const mintNft = async () => {
  try {
    const now = new Date().getTime();
    const { uri: tokenURI } = await createMetadata();
    const receipt = await caver.kas.kip17.mint(
      process.env.KAS_NFT_CONTRACT_ADDRESS,
      "0x2523b80c1F018cc1A13D8ffcef6E0383cdf9D5af",
      now,
      tokenURI
    );
    return receipt;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const mintNftNew = async (uri, userWallet) => {
  try {
    const token_id = new Date().getTime();
    const receipt = await caver.kas.kip17.mint(
      process.env.KAS_NFT_CONTRACT_ADDRESS,
      userWallet,
      token_id,
      uri
    );
    return { ...receipt, token_id };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getNftDataTest = async () => {
  try {
    const data = await caver.kas.kip17.getToken(
      process.env.KAS_NFT_CONTRACT_ADDRESS,
      1671076068962
      // "0x18513e53e62"
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getNftDetail = async token_id => {
  try {
    const data = await caver.kas.kip17.getToken(
      process.env.KAS_NFT_CONTRACT_ADDRESS,
      token_id
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const KasWallet = {
  hello,
  createWallet,
  registerNftImage,
  createMetadata,
  createMetadataNew,
  mintNft,
  mintNftNew,
  getNftDataTest,
  getNftDetail
};

export default KasWallet;
