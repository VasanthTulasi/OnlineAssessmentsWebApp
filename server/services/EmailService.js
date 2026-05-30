"use strict";
const nodemailer = require("nodemailer");

/*
Title: SMTP Transport
Author: Node Mailer
Date: NA
Source: http://nodemailer.com/smtp/
Details: This piece of code is used for multiple methods.
*/
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendPasswordResetMail = async (recipientID, token) =>
  await transporter.sendMail(
    {
      from: "Admin AssessOnline <noreply@AssessOnline.com>",
      to: recipientID,
      subject: "Password Reset Link - AssessOnline",
      text:
        "Please click on the below email link or paste is in the browser to reset your password. The link will expire in 10 minutes.\nLink: http://localhost:3000/resetPassword/" +
        token,
    },
    function (err, inf) {
      if (err) console.log("Error is " + err.message);
      else {
        console.log("link: http://localhost:3000/resetPassword/" + token);
        console.log("Success " + inf.response);
      }
    }
  );

const sendRegActivationMail = async (recipientID, token) =>
  await transporter.sendMail(
    {
      from: "Admin AssessOnline <noreply@AssessOnline.com>",
      to: recipientID,
      subject: "Account Approved - AssessOnline",
      text:
        "Dear User,\n\nYour AssessOnline account has been successfully approved by the admin.\n\nPlease click on the below email link or paste is in the browser to activate your account. \nLink: http://localhost:3000/accountActivate/" +
        token,
    },
    function (err, inf) {
      if (err) console.log("Error is " + err.message);
      else {
        console.log("Success " + inf.response);
        console.log("http://localhost:3000/accountActivate/" + token);
      }
    }
  );

const sendRegApprovalMail = async (recipientID) =>
  await transporter.sendMail(
    {
      from: "Admin AssessOnline <noreply@AssessOnline.com>",
      to: recipientID,
      subject: "Account Activated - Admin AssessOnline",
      text: "Dear User,\n\nYour AssessOnline account is activated. You can now login to the application.\n\nPlease reach out to the admin in case of any issues.\n\nRegards,\nAssessOnline.",
    },
    function (err, inf) {
      if (err) console.log("Error is " + err.message);
      else console.log("Success " + inf.response);
    }
  );

const sendRegRejectionMail = async (recipientID, rejectionReason) =>
  await transporter.sendMail(
    {
      from: "Admin AssessOnline <noreply@AssessOnline.com>",
      to: recipientID,
      subject: "Registration Denied - Admin AssessOnline",
      text:
        "Dear User,\n\nYour request for AssessOnline account has been denied by the admin with the reason mentioned below. Please reach out to the admin for further details.\n\nReason: " +
        rejectionReason +
        "\n\nRegards,\nAssessOnline.",
    },
    function (err, inf) {
      if (err) console.log("Error is " + err.message);
      else console.log("Success " + inf.response);
    }
  );

const sendAssessmentScheduledEmail = async (recipientID, assessmentInfo) =>
  await transporter.sendMail({
    from: "Admin AssessOnline <noreply@AssessOnline.com>",
    to: recipientID,
    subject: "Assessment Scheduled - Admin AssessOnline",
    text:
      "Dear Student,\n\nThis is to notify you that a new assessment has been scheduled for one of your course modules. Please find the details below.\n" +
      "\nModule Code: " +
      assessmentInfo.module_code +
      "\nAssessment Duration: " +
      assessmentInfo.duration +
      "\nAssessment Window Start Time: " +
      assessmentInfo.window_start_time +
      "\nAssessment Window End Time: " +
      assessmentInfo.window_end_time +
      "\nAssessment Total Marks: " +
      assessmentInfo.total_marks +
      "\n\nPlease keep checking 'View My Assessments' page in AssessOnline to view any updates for this assessment." +
      "\n\nRegards,\nAssessOnline.",
  });

module.exports.passwordResetMail = sendPasswordResetMail;
module.exports.regApprovalMail = sendRegApprovalMail;
module.exports.regActivationMail = sendRegActivationMail;
module.exports.regRejectionMail = sendRegRejectionMail;
module.exports.assessmentScheduledEmail = sendAssessmentScheduledEmail;
