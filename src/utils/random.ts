export const verificationCodeGenerator = () => {
  // len = 6;
  const code = Math.floor(Math.random() * (1000000 - 100000)) + 100000;
  return code;
};

export const passwordGenerator = () => {
  // len = 10
  const char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const number_list = "1234567890";
  const special_list = "!@#$%^&*()";
  const _newCharPwd = new Array(6).fill("");
  const _newNumPwd = new Array(2).fill("");
  const _newSpecialPwd = new Array(2).fill("");
  const _newPwdArr = [];
  _newCharPwd.map(item =>
    _newPwdArr.push(char_list[Math.floor(Math.random() * char_list.length)])
  );
  _newNumPwd.map(item =>
    _newPwdArr.push(number_list[Math.floor(Math.random() * number_list.length)])
  );
  _newSpecialPwd.map(item =>
    _newPwdArr.push(
      special_list[Math.floor(Math.random() * special_list.length)]
    )
  );
  const newPwd = _newPwdArr
    .sort(() => 0.5 - Math.random())
    .reduce((a, b) => a + b, "");

  return newPwd;
};
