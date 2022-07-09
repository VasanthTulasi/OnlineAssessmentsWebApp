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


const sendMail = async (recipientID,token) => await transporter.sendMail({
    from: 'Admin Online Assessments <noreply@onlineassessments.com>',
    to: recipientID,
    subject: "Password Reset - Online Assessments",
    text: "Please click on the below email link or paste is in the browser to reset your password. The link will expire in 10 minutes.\nLink: http://localhost:3000/resetPassword/" + token
  }, function(err, inf){
    if(err)
    console.log("Error is "+err.message);
    else
    console.log("Success "+inf.response);
  });


module.exports = sendMail;




