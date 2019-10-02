const express = require('express');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const skillRoutes = require('./skillArea.route');
const skillCtrl = require('./skillArea.controller');

// router.use('/:id', (req, next) => {
//   req.skill = req.body.skillArea;
//   next();
// });

router.route('/').post(requireAuth, skillCtrl.createSkill);

router.route('/').get(requireAuth, skillCtrl.getAllSkill);
router.route('/:id').get(requireAuth, skillCtrl.getSkillInfo);
router
  .route('/:id')
  .put(requireAuth, skillCtrl.updateSkillInfo)
  .delete(requireAuth, skillCtrl.deleteSkillInfo);
router.param('id', skillCtrl.skillLoad);
module.exports = router;
