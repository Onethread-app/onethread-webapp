// individual user inSormation
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Account = require('./account.model');
const companyUserSchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true
    },
    companyAddress: {
        type: String,
        required: true
    },
    selectDistrict: {
        type: String,
        required: true
    },
    selectThana: {
        type: String,
        required: true
    },
    businessDescription: {
        type: String,
    },
    tradeLicense: {
        type: String,
        required: true
    },

    contactPersonName: {
        type: String,
        required: true
    },
    contactPersonDesignation: {
        type: String,
        required: true
    },
    contactPersonEmail: {
        type: String,
    },
    contactPersonMobile: {
        type: String,
        unique: true,
        required: true
    },

    // category: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category'
    // },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
})
module.exports = mongoose.model('CompanyUser', companyUserSchema);