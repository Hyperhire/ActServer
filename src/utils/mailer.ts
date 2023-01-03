import nodemailer from "nodemailer";
import Templates from "../html/forms";
import { config } from "./../config/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.MAILER_EMAIL,
    pass: config.MAILER_PASSWORD
  }
});

export const sendResetPasswordMail = async (email, password) => {
  const info = await transporter.sendMail({
    from: "DOACT",
    to: email,
    subject: "액트(ACT) 임시 비밀번호 안내메일입니다",
    text: "회원님의 임시 비밀번호가 발급되었습니다. 로그인 후 반드시 비밀번호를 변경해주세요.",
    html: Templates.resetPasswordEmailTemplate(password)
  });
  return info;
};

export const sendVerificationMail = async (email, verificationCode) => {
  const info = await transporter.sendMail({
    from: "DOACT",
    to: email,
    subject: "액트(ACT) 회원가입 인증코드입니다",
    text: `ACT 서비스 이용 신청에 감사드립니다.인증코드로 인증을 완료하시면 회원가입이 완료됩니다.`,
    html: Templates.verificationEmailTemplate(verificationCode)
  });
  return info;
};
