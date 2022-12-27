const resetPasswordEmailTemplate = password => {
  return `<table width="100%" cellpadding="48" align="center">
  <table width="100%" align="center">
    <tr>
      <td>
        <font size="5" weight="bold">
          <b>액트(ACT)</b>
        </font>
      </td>
    </tr>
    <tr>
      <td>
        <font size="5">
          <b>임시 비밀번호 안내메일입니다.</b>
        </font>
      </td>
    </tr>
    <tr height="20"></tr>
    <hr />
    <tr height="20"></tr>
    <tr>
      <td>
        <font color="#777777">
          안녕하세요. 회원님의 임시 비밀번호는 아래와 같습니다.
        </font>
      </td>
    </tr>
    <tr>
      <td>
        <font color="#777777">
          로그인후 반드시 비밀번호를 변경해주세요
        </font>
      </td>
    </tr>
    <tr height="40"></tr>
    <tr>
      <td>
        <b>임시비밀번호</b>
      </td>
    </tr>
    <tr height="12"></tr>
    <tr align="center">
      <td bgColor="#FDD22C" height="64">
        <font size="4">
          <b>${password}</b>
        </font>
      </td>
    </tr>
  </table>
</table>`;
};

const verificationEmailTemplate = code => {
  return `<table width="100%" cellpadding="48" align="center">
  <table width="100%" align="center">
    <tr>
      <td>
        <font size="5" weight="bold">
          <b>액트(ACT) 회원가입</b>
        </font>
      </td>
    </tr>
    <tr>
      <td>
        <font size="5">
          <b>이메일 주소 인증코드입니다.</b>
        </font>
      </td>
    </tr>
    <tr height="20"></tr>
    <hr />
    <tr height="20"></tr>
    <tr>
      <td>
        <font color="#777777">
          ACT 서비스 이용 신청에 감사드립니다.
        </font>
      </td>
    </tr>
    <tr>
      <td>
        <font color="#777777">
          아래 인증코드로 인증 완료하시면 회원가입이 완료됩니다.
        </font>
      </td>
    </tr>
    <tr height="40"></tr>
    <tr>
      <td>
        <b>인증코드를 회원가입 화면에 입력하세요.</b>
      </td>
    </tr>
    <tr height="12"></tr>
    <tr align="center">
      <td bgColor="#FDD22C" height="64">
        <font size="4">
          <b>${code}</b>
        </font>
      </td>
    </tr>
  </table>
</table>`;
};

const Templates = { resetPasswordEmailTemplate, verificationEmailTemplate };

export default Templates;
