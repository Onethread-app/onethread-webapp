const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');
const config = require('../../config/config');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY, { apiVersion: '' });

const Payment = require('./payment.model');
const logger = require('../../config/winston');

const { sendJSONresponse } = require('../helpers/jsonResponse');

const { Member } = require('../company/member/member.model');
const { CompanyCouponModel } = require('../coupon/companyCouponModel');

const create = async (req, res, next) => {
  try {
    // let ipn_body = {};
    // ipn_body['app_key'] = "9a78d14d58483269577bf112dd7a57e3";
    // ipn_body['timestamp'] =  Date.now();
    // ipn_body['token'] = md5sum.update( '1e2db2824da38d96082a7f521ac9b15c' +ipn_body['timestamp']).digest('hex') ;
    // ipn_body['amount'] = 100.26;
    // ipn_body['call'] = "ipn_validate";
    // ipn_body['invoice'] =  '85EF827D83EB7931';

    // const url = 'https://api-sandbox.portwallet.com/api/v1/';
    // const response = await axios(url, {method: 'POST', data: qs.stringify(ipn_body)});

    let payment = new Payment({
      amount: req.body.amount,
      gateway: req.body.gateway,
      currency: req.body.currency,
      reference: req.body.reference,
      company: req.body.company,
      subscription: req.body.subscription,
      account: req.user,
    });

    payment = await payment.save();
    return sendJSONresponse(res, 201, payment);
  } catch (e) {
    logger.error(`Payment: ${e}`);
    next(e);
  }
};

const initiateInvoice = async (req, res, next) => {
  try {
    const md5sum = crypto.createHash('md5');

    const postBody = {};

    postBody.app_key = '9a78d14d58483269577bf112dd7a57e3';
    postBody.timestamp = Date.now();
    postBody.token = md5sum
      .update('1e2db2824da38d96082a7f521ac9b15c' + postBody.timestamp)
      .digest('hex');
    postBody.amount = req.body.amount;
    postBody.call = 'gen_invoice';
    postBody.currency = 'BDT';
    postBody.redirect_url = req.body.redirect_url;
    postBody.product_name = 'BDT';
    postBody.product_description = 'afd@ncn.co';
    postBody.state = 'BDT';
    postBody.email = 'afd@ncn.co';
    postBody.name = 'afd@ncn.co';
    postBody.country = 'BD';
    postBody.phone = '+881234567890';
    postBody.city = 'BDT';
    postBody.zipcode = '1234';
    postBody.address = 'https://476a00fea8a8.ngrok.io';

    const url = 'https://api-sandbox.portwallet.com/api/v1/';
    const response = await axios(url, {
      method: 'POST',
      data: qs.stringify(postBody),
    }); // qs.stringify(post_body)
    const urlInvoice =
      'https://payment-sandbox.portwallet.com/payment/?invoice=' +
      response.data.data.invoice_id;

    if (req.body.coupon) {
      await CompanyCouponModel.findOneAndUpdate(
        { _id: req.body.coupon },
        { isUsed: true },
        { safe: true, upsert: true, new: true },
      ).exec();
    }
    return sendJSONresponse(res, 200, { paymentUrl: urlInvoice });
  } catch (e) {
    logger.error(`Payment: ${e}`);
    next(e);
  }
};

const paymentIntent = async (req, res, next) => {
  try {
    const intent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100, // because cents to dollar
      currency: 'usd',
      // Verify your integration in this guide by including this parameter
      metadata: { integration_check: 'accept_a_payment' },
    });
    return sendJSONresponse(res, 200, { client_secret: intent.client_secret });
  } catch (e) {
    logger.error(`Payment: ${e}`);
    next(e);
  }
};

const list = async (req, res, next) => {
  try {
    const { skip = 0, limit = 50 } = req.query;
    const payments = await Payment.find({ company: req.params.companyId })
      .select('status amount currency refrence createdAt')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();

    return sendJSONresponse(res, 200, payments);
  } catch (error) {
    logger.error(`Payment: ${error}`);
    next(error);
  }
};

const subscriber = async (req, res, next) => {
  try {
    const memberList = await Member.find({
      company: req.headers.companyid,
    });
    return sendJSONresponse(res, 200, memberList.length);
  } catch (error) {
    logger.error(`Payment: ${error}`);
    next(error);
  }
};

module.exports = {
  initiateInvoice,
  paymentIntent,
  list,
  create,
  subscriber,
};
