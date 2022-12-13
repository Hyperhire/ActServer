const CaverExtKAS = require("caver-js-ext-kas");

const caver = new CaverExtKAS();
caver.initWalletAPI(
  1001,
  "KASKZRF7JHCQXUTNDI4L9D1Q",
  "AqgrJFphfUWdDUpg4LKVYrIXqh5b-2AA36kxkvQY"
);
// console.log(caver);

const hello = () => {
  //   console.log("hello?", caver);
  console.log("hello?");
};

const createWallet = async () => {
  console.log("wallet creation started");
  const wallet = await caver.kas.wallet.createAccount();
  console.log("wallet creation started return", wallet);
  return wallet;
};

const KasWallet = { hello, createWallet };

export default KasWallet;