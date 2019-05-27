"use strict";
const express = require("express");
const nodemailer = require("nodemailer");
//const transport = require('nodemailer-smtp-transport');
//const app = express()
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "robatdas2018@gmail.com",
    pass: "123robat321"
  }
});

module.exports = transporter;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/
