import nodemailer from "nodemailer";
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

export const sendTestMail = async () => {
  const info = await transporter.sendMail({
    from: '"Conan haha 👻" <foo@example.com>', // sender address
    to: "conan.kim@hyperhire.in, juhyun.kim0204@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });
  console.log("Message sent: %s", info.messageId);
  return info;
};

export const sendResetPasswordMail = async (email, password) => {
  const info = await transporter.sendMail({
    from: "DOACT",
    to: email,
    subject: "비밀번호 변경 메일입니다", // Subject line
    text: `변경된 비밀번호로 로그인하세요 하하 ${password}`, // plain text body
    html: `변경된 비밀번호로 로그인하세요 하하 ${password}` // html body
  });
  return info;
};
