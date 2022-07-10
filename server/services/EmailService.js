"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "lalithavasanth10@gmail.com",
      pass: "yizlemewhqwkqhjx"
    }
  });


const sendPasswordResetMail = async (recipientID,token) => await transporter.sendMail({
    from: 'Admin OnlineAssess <noreply@OnlineAssess.com>',
    to: recipientID,
    subject: "Password Reset - OnlineAssess",
    text: "Please click on the below email link or paste is in the browser to reset your password. The link will expire in 10 minutes.\nLink: http://localhost:3000/resetPassword/" + token
  }, function(err, inf){
    if(err)
    console.log("Error is "+err.message);
    else
    console.log("Success "+inf.response);
  });

  const sendRegActivationMail = async (recipientID,token) => await transporter.sendMail({
    from: 'Admin OnlineAssess <noreply@OnlineAssess.com>',
    to: recipientID,
    subject: "Account Activation - OnlineAssessm",
    text: "Dear User,\n\nYour OnlineAssess account has been successfully approved by the admin.\n\nPlease click on the below email link or paste is in the browser to activate your account. \nLink: http://localhost:3000/accountActivate/" + token
  }, function(err, inf){
    if(err)
    console.log("Error is "+err.message);
    else
    console.log("Success "+inf.response);
  });

  const sendRegApprovalMail = async (recipientID) => await transporter.sendMail({
    from: 'Admin OnlineAssess <noreply@OnlineAssess.com>',
    to: recipientID,
    subject: "Registration Approved - Admin OnlineAssess",
    text: "Dear User,\n\nYour OnlineAssess account is activated. You can now login to the application.\n\nPlease reach out to the admin in case of any issues.\n\nRegards,\nOnlineAssess."
  }, function(err, inf){
    if(err)
    console.log("Error is "+err.message);
    else
    console.log("Success "+inf.response);
  });

  const sendRegRejectionMail = async (recipientID) => await transporter.sendMail({
    from: 'Admin OnlineAssess <noreply@OnlineAssess.com>',
    to: recipientID,
    subject: "Registration Denied - Admin OnlineAssess",
    text: "Dear User,\n\nYour request for OnlineAssess account has been denied by the admin. Please reach out to the admin for further details.\n\nRegards,\nOnlineAssess."
  }, function(err, inf){
    if(err)
    console.log("Error is "+err.message);
    else
    console.log("Success "+inf.response);
  });


module.exports.passwordResetMail = sendPasswordResetMail;
module.exports.regApprovalMail = sendRegApprovalMail;
module.exports.regActivationMail = sendRegActivationMail;
module.exports.regRejectionMail = sendRegRejectionMail;





