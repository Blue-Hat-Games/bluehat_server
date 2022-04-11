// 이메일 전송 API
const mailgun = require("mailgun-js");

// 이메일 인증 키 생성
const Crypto = require("crypto-js");

// For Email Template
var ejs = require("ejs");
var fs = require("fs");
var mailContents = fs.readFileSync("./views/email.ejs", "ASCII");

// 이메일 유효성 검증
exports.verifyEmail = function (emailStr) {
  var regExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if (emailStr.match(regExp) != null) {
    return true;
  } else {
    return false;
  }
};

// 이메일 암호화
exports.encryptEmail = function (data) {
  return Crypto.AES.encrypt(data, process.env.EMAIL_AUTH_KEY).toString();
};

// 이메일 복호화
exports.decryptEmail = function (data) {
  return Crypto.AES.decrypt(data, process.env.EMAIL_AUTH_KEY).toString(
    Crypto.enc.Utf8
  );
};

// 이메일 내용 생성
getEmailContents = function (authKey) {
  const requestUrl = `http://bluehat.games/auth?authKey=${encodeURIComponent(
    authKey
  )}`;
  const emailContents = ejs.render(mailContents, { link: requestUrl });
  return emailContents;
};

// Mailgun API를 활용해 인증 메일 전송
exports.sendVerifyEmail = function (userMailAdress, authKey) {
  const DOMAIN = "bluehat.games";

  const mg = mailgun({
    apiKey: process.env.EMAILGUM_API_KEY,
    domain: DOMAIN,
  });

  const data = {
    from: "Bluehat Games <no-reply@bluehat.games>",
    to: userMailAdress,
    subject: "Bluehat Games 이메일 인증",
    html: getEmailContents(authKey),
  };

  mg.messages().send(data, function (error, body) {
    console.log(body);
    if (error) {
      console.log(error);
      return false;
    }
  });
  return true;
};
