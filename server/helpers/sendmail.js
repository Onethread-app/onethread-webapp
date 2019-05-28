'use strict';
const express = require('express');
const nodemailer = require("nodemailer");
const config = require("../../config/config");
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: config.mail_address,
        pass: config.password,
    }
});

module.exports= transporter;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

