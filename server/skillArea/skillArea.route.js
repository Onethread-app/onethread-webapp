const express = require('express');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const skillCtrl = require('./skillArea.controller');

// router.use('/:id', (req, next) => {
//   req.skill = req.body.skillArea;
//   next();
// });

router.route('/').post(requireAuth, skillCtrl.createSkill);

// router.route('/').get(requireAuth, skillCtrl.getAllSkill);
// router.route('/:id').get(requireAuth, skillCtrl.getSkillInfo);
// router
//   .route('/:id')
//   .put(requireAuth, skillCtrl.updateSkillInfo)
//   .delete(requireAuth, skillCtrl.deleteSkillInfo);
router.route('/search').get(requireAuth, skillCtrl.searchSkillSet);
router.param('id', skillCtrl.skillLoad);

module.exports = router;
