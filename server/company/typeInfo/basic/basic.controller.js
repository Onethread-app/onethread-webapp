'use strict';
const { Basic } = require('./basic.model');

// create a Basic profile
const createBasicProfile = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  // storing requested company's id
  req.body.company = req.currentCompany;

  // return res.status(201).json(req.body);
  const newBasic = new Basic(req.body);

  newBasic
    .save()
    .then(result => {
      res.status(201).json({
        message: 'New Basic-info created',
        newBasic: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

// // get a Basic profile
// const getBasicProfile = async (req, res) => {
//   Basic.findById(req.params.id)
//     .select('_id type account createdAt updatedAt')
//     .populate('account', 'email')
//     .exec()
//     .then(result => {
//       if (result) {
//         res.status(200).json({
//           Basic: {
//             id: result.id,
//             type: result.type,
//             account: {
//               id: result.account.id,
//               email: result.account.email
//             },
//             createdAt: result.createdAt,
//             updatedAt: result.updatedAt
//           }
//         });
//       } else {
//         res.status(404).json({ message: 'No Basic found' });
//       }
//     })
//     .catch(err => {
//       res.status(500).json({ error: err });
//     });
// };

// // update a Basic profile
// const updateBasicProfile = async (req, res) => {
//   // Check for JSON
//   if (!req.is('application/json')) {
//     return res.send("Expects 'application/json'");
//   }
//   Basic.findOneAndUpdate({ _id: req.params.id }, req.body)
//     .exec()
//     .then(result => {
//       if (result) {
//         res.status(200).json({
//           message: 'Basic updated'
//         });
//       } else {
//         res.status(404).json({ message: 'No Basic found' });
//       }
//     })
//     .catch(err => {
//       res.status(500).json({ error: err });
//     });
// };
// // delete a Basic profile
// const deleteBasicProfile = async (req, res) => {
//   Basic.findByIdAndRemove({ _id: req.params.id })
//     .exec()
//     .then(result => {
//       if (result) {
//         res.status(200).json({
//           message: 'Basic deleted'
//         });
//       } else {
//         res.status(404).json({ message: 'No Basic found' });
//       }
//     })
//     .catch(err => {
//       res.status(500).json({ error: err });
//     });
// };

module.exports = {
  createBasicProfile
  // getBasicProfile,
  // updateBasicProfile,
  // deleteBasicProfile
};
