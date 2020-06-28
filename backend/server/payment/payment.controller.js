const Payment = require('./payment.model');
const logger = require('../../config/winston');
const config = require('../../config/config');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY, {apiVersion: ''});

const {
  sendJSONresponse,
} = require('../helpers/jsonResponse');

const create = async (req, res, next) => {

  try{
  
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
    console.log(e)
    logger.error(`Payment: ${error}`);
      next(e);
  }
      
};

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
    logger.error(`Payment: ${error}`);
      next(e);
  }
      
};

const list = async (req, res, next) => {
  try {
    console.log(req.params.companyId)
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
    paymentIntent,
    list,
    create,
  };