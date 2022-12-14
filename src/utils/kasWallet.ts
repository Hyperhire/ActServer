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
        "https://metadata-store.klaytnapi.com/fd2f81df-cfaa-32f4-bbfa-52ad7b378c6f/eb769b52-2d42-12f4-4a53-1fd7e81d3520.png",
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
    const now = new Date().getTime();
    const receipt = await caver.kas.kip17.mint(
      process.env.KAS_NFT_CONTRACT_ADDRESS,
      userWallet,
      now,
      uri
    );
    return receipt;
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
  mintNft,
  mintNftNew
};

export default KasWallet;
