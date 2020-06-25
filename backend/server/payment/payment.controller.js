const Payment = require('./payment.model');
const logger = require('../../config/winston');
const config = require('../../config/config');
<<<<<<< HEAD
const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');
=======
>>>>>>> 3a98ae02... Wip/tig 229 (#232)
const stripe = require('stripe')(config.STRIPE_SECRET_KEY, {apiVersion: ''});

const {
  sendJSONresponse,
} = require('../helpers/jsonResponse');

const create = async (req, res, next) => {

  try{
<<<<<<< HEAD

  // let ipn_body = {};
  // ipn_body['app_key'] = "9a78d14d58483269577bf112dd7a57e3";
  // ipn_body['timestamp'] =  Date.now();
  // ipn_body['token'] = md5sum.update( '1e2db2824da38d96082a7f521ac9b15c' +ipn_body['timestamp']).digest('hex') ;
  // ipn_body['amount'] = 100.26;
  // ipn_body['call'] = "ipn_validate";
  // ipn_body['invoice'] =  '85EF827D83EB7931';

  // const url = 'https://api-sandbox.portwallet.com/api/v1/';
  // const response = await axios(url, {method: 'POST', data: qs.stringify(ipn_body)}); 


=======
>>>>>>> 3a98ae02... Wip/tig 229 (#232)
  
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
<<<<<<< HEAD
    
    logger.error(`Payment: ${e}`);
=======
    console.log(e)
    logger.error(`Payment: ${error}`);
>>>>>>> 3a98ae02... Wip/tig 229 (#232)
      next(e);
  }
      
};

<<<<<<< HEAD
const initiateInvoice = async (req, res, next) => {

  try{
    
  const md5sum = crypto.createHash('md5');

  let post_body = {};

  post_body['app_key'] = "9a78d14d58483269577bf112dd7a57e3";
  post_body['timestamp'] =  Date.now();
  post_body['token'] = md5sum.update( '1e2db2824da38d96082a7f521ac9b15c' +post_body['timestamp']).digest('hex') ;
  post_body['amount'] = req.body.amount;
  post_body['call'] = 'gen_invoice';
  post_body['currency'] = "BDT";
  post_body['redirect_url'] = req.body.redirect_url;
  post_body['product_name'] = "BDT";
  post_body['product_description'] = "afd@ncn.co";
  post_body['state'] = "BDT";
  post_body['email'] = "afd@ncn.co";
  post_body['name'] = "afd@ncn.co";
  post_body['country'] = "BD";
  post_body['phone'] = "+881234567890";
  post_body['city'] = "BDT";
  post_body['zipcode'] = "1234";
  post_body['address'] = "https://476a00fea8a8.ngrok.io";


  const url = 'https://api-sandbox.portwallet.com/api/v1/';
  const response = await axios(url, {method: 'POST', data: qs.stringify(post_body)});  //qs.stringify(post_body)
  const urlInvoice = 'https://payment-sandbox.portwallet.com/payment/?invoice='+response.data.data.invoice_id;

    return sendJSONresponse(res, 200, {paymentUrl: urlInvoice});

  } catch (e) {
    
    logger.error(`Payment: ${e}`);
    next(e);
  }
      
};

=======
>>>>>>> 3a98ae02... Wip/tig 229 (#232)
const paymentIntent = async (req, res, next) => {

  try{
    
    const intent = await stripe.paymentIntents.create({
      amount: req.body.amount*100, //because cents to dollar
      currency: 'usd',
      // Verify your integration in this guide by including this parameter
      metadata: {integration_check: 'accept_a_payment'},
    });
    return sendJSONresponse(res, 200, {client_secret: intent.client_secret});

  } catch (e) {
<<<<<<< HEAD
    logger.error(`Payment: ${e}`);
=======
    logger.error(`Payment: ${error}`);
>>>>>>> 3a98ae02... Wip/tig 229 (#232)
      next(e);
  }
      
};

const list = async (req, res, next) => {
  try {
<<<<<<< HEAD
   
=======
    console.log(req.params.companyId)
>>>>>>> 3a98ae02... Wip/tig 229 (#232)
    const { skip = 0, limit = 50 } = req.query;
    const payments = await Payment.find({company:req.params.companyId})
      .select('status amount currency refrence createdAt')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()
      
      return sendJSONresponse(res, 200, payments);
  } catch (error) {
    logger.error(`Payment: ${error}`);
    next(error);
  }
};

  module.exports = {
<<<<<<< HEAD
    initiateInvoice,
=======
>>>>>>> 3a98ae02... Wip/tig 229 (#232)
    paymentIntent,
    list,
    create,
  };