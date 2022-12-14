const CaverExtKAS = require("caver-js-ext-kas");

const caver = new CaverExtKAS();
caver.initWalletAPI(
  process.env.KAS_CHAIN_ID,
  process.env.KAS_ACCESS_KEY,
  process.env.KAS_SECRET_ACCESS_KEY
);

const hello = () => {
  console.log("hello?");
};

const createWallet = async () => {
  return await caver.kas.wallet.createAccount();
};

const KasWallet = { hello, createWallet };

export default KasWallet;
