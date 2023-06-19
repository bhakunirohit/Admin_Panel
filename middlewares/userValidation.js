const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const otp = require("../models/otp");
const bcrypt = require("bcrypt");

// validation for registration

var registerValidation = [
  /*------------validation for first_name--------------*/
  check("name")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Enter name")
    .bail()
    .isLength({ min: 2 })
    .withMessage("Name must have 3 words")
    .bail()
    .isAlpha()
    .withMessage("Name Cannot Contain Number"),

  /*------------validation for email--------------*/
  check("email")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Enter Email")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email")
    .bail()
    .custom(async (value) => {
      const user = await User.find({ email: value });

      if (user.length > 0) {
        throw new Error("Email already exists");
      }
    }),

  /*------------validation for password--------------*/
  check("password")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Enter Password")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Password must 4 characters"),

  /*------------validation for Confirm password--------------*/
  check("confirm_password").custom(async (value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Password and Confirm password must be same");
    }
  }),
];

//validation for login

const loginvalidation = [
  check("email")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Enter Email")
    .bail()
    .custom(async (value) => {
      const user = await User.find({ email: value });

      if (user.length === 0) {
        throw new Error("Invalid email ");
      }
    }),

  /*------------validation for password--------------*/

  check("password")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Enter Password")
    .bail()

    /*------------bcrypt password--------------*/

    .custom(async (value, { req }) => {
      const emaill = req.body.email;
      const pass = await User.find({ email: emaill });
      if (pass && pass.length > 0) {
        const verfication = await bcrypt.compare(value, pass[0].password);
        if (verfication == false) {
          throw new Error(" Password incorrect");
        }
      } else {
        throw new Error(" Invalid Password ");
      }
    }),

  /*------------verified user or not--------------*/
  check("is_verified")
    .custom(async (value, { req }) => {
      const emaill = req.body.email;
      const data = await User.find({ email: emaill });

      if (data.length > 0) {
        if (data == null) {
          return;
        }
        if (
          (await bcrypt.compare(req.body.password, data[0].password)) == false
        ) {
          return;
        }
        if (data[0].is_verified == 0) {
          throw new Error("Please verify your Email");
        }
      }
    })
    .bail(),
];

//Enter email to chagePassword Validation
const Passvalidation = [
  check("email")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Enter Email")
    .bail()
    .custom(async (value) => {
      const user = await User.find({ email: value });

      if (user.length === 0) {
        throw new Error("Invalid email ");
      }
    }),

  /*------------verified user or not--------------*/
  check("is_verified")
    .custom(async (value, { req }) => {
      const emaill = req.body.email;
      const data = await User.find({ email: emaill });

      if (data.length > 0) {
        if (data[0].is_verified == 0) {
          throw new Error("Please verify your Email");
        }
      }
    })
    .bail(),
];

// Validation for otp

const otpValidation = [
  check("otp")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Enter OTP")
    .bail()
    .isNumeric()
    .withMessage("Code must be numeric")
    .bail(),
  /*------------correct otp or not--------------*/
  check("code")
    .custom(async (value, { req }) => {
      const userEmail = req.session.emailId;
      console.log(req.session.emailId, "userremail");

      const userOtp = req.body.otp;

      let data = await otp.find({ email: userEmail, code: userOtp });

      if (data.length > 0) {
        let currentTime = new Date().getTime();
        let diff = data[0].expire_in - currentTime;

        if (diff < 0) {
          throw new Error("Expired Otp");
        }
      }

      if (data.length <= 0) {
        throw new Error("Invalid otp ");
      }
    })
    .bail(),
];

//chagePassword Validation
const changePassValidation = [
  /*------------validation for password--------------*/
  check("password")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Enter Password")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Password must 4 characters"),

  /*------------validation for Confirm password--------------*/
  check("confirmPassword").custom(async (value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Password and Confirm password must be same");
    }
  }),
];

module.exports = {
  registerValidation,
  otpValidation,
  loginvalidation,
  Passvalidation,
  changePassValidation,
};
