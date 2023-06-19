const express= require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const UserValidation = require('../../../middlewares/userValidation')
require('../../../helpers/googleAuth');
const passport = require('passport')
const authentication = require('../../../middlewares/authentication/authentication');





 // Signup routes
router.get('/',userController.signup);
router.post('/', UserValidation.registerValidation,userController.postSignup);
router.get('/verify/',userController.verifyEmail);




//login routes
router.get('/login', userController.login);
router.post('/login', UserValidation.loginvalidation,userController.Postlogin)

router.get('/auth/google',
  passport.authenticate('google', { scope:
      [  'profile','email' ] }
));



//AdminPanel/Homepage Routes
router.get('/homepage',authentication.userAuthentication, userController.homepage);
router.get('/homepage/logout',userController.logout);




//Forgot Password routes
router.get('/password',userController.password);
router.post('/password',UserValidation.Passvalidation ,userController.postPassword);
router.get('/password/postotp',authentication.sessionAuthentication,userController.otpController);
router.post('/password/postotp',UserValidation.otpValidation,userController.postOtp);
// router.get('/postotp/changepassword',authentication.sessionAuthentication,forgotPass.changePassword);
router.post('/password/postotp/changepassword',UserValidation.changePassValidation,userController.postchangepassword);



module.exports = router;