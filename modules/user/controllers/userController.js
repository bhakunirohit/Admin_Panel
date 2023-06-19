const User = require("../../../models/user");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const sendEmail = require("../../../helpers/nodemailer");
const passport = require("passport");
const {
  response_status,
  statusCode,
} = require("../../../core/constant/constant");
const response = require("../../../response-handler/response");
const Otp = require("../../../models/otp");
const otpgenerator = require("../../../response-handler/response");

class signupController {


  // signup get request
  async signup(req, res) {
    try {
      res.render("signup", { data: [] });
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }



  // post signup request
  async postSignup(req, res) {
    try {
      const data = validationResult(req);
      const errors = data.errors;
      if (errors.length > 0) {
        res.render("signup", {
          data: errors,
        });
      } else {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          is_verified: 0,
        });

        const data = await user.save();
        const fullName = user.name;
        const userId = user._id;
        const emailTO = req.body.email;
        const emailFrom = "rohitbhakuni@gmail.com";

        let url = "http://localhost:5000/verify?id=" + userId;

        sendEmail({
          from: emailFrom,
          to: emailTO,
          subject: "Email Verification",
          text: `${emailFrom} shared you a link to verify your email`,
          html:
            "Greetings of the hour " +
            fullName +
            ',please click here <a href="' +
            url +
            '">Verify</a> your mail',
        });

        res.redirect("/login");
      }
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }



  // login get request
  async login(req, res) {
    try {
      res.render("login", { dataLogin: [] });
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }



  //login Post request
  async Postlogin(req, res) {
    try {
      const dataLogin = validationResult(req);
      const errors = dataLogin.errors;

      if (errors.length > 0) {
        res.render("login", {
          dataLogin: errors,
        });
      } else {
        const usersData = await User.findOne({ email: req.body.email });
        // console.log(User.explain('executionStats'));
        req.session.user = usersData.email;
        res.redirect("/homepage");
      }
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }



  //verify email during signup
  async verifyEmail(req, res, next) {
    try {
      await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });
      res.redirect("/login");
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }



  //homepage/AdminPanel get request
  async homepage(req, res) {
    try {
      res.render("adminpanel");
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }



  //Homepage post request
  async logout(req, res) {
    try {
      req.session.destroy();
      res.redirect("/login");
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }



  //forgotPassword get request
  async password(req, res) {
    try {
      res.render("forgotpassword", { dataLogin: [] });
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }


0
  // forgotPassword post request
  async postPassword(req, res) {
    try {
      const dataLogin = validationResult(req);
      const errors = dataLogin.errors;
      req.session.emailId = req.body.email;
      if (errors.length > 0) {
        res.render("forgotpassword", { dataLogin: errors });
      } else {
        let otpcode = otpgenerator.otpgenerator();
        let otpData = new Otp({
          email: req.body.email,
          code: otpcode,
          expire_in: new Date().getTime() + 300 * 1000,
        });
        let otpResponse = await otpData.save();

        const fullName = otpData.email;
        const emailTO = req.body.email;
        const emailFrom = "rohitbhakuni@gmail.com";

        sendEmail({
          from: emailFrom,
          to: emailTO,
          subject: "OTP to Reset Password",
          text: `${emailFrom} shared you a OTP reset password`,
          html:
            "Greetings of the hour " +
            fullName +
            ",please use this otp  " +
            otpcode +
            "   to change password",
        });

        res.redirect("/password/postotp");
      }
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }



  // get otp request
  async otpController(req, res) {
    try {
      res.render("otp", { dataLogin: [], emailId: req.session.emailId });
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }



  //post otp request
  async postOtp(req, res) {
    try {
      const data = req.body;
      const dataLogin = validationResult(req);
      const errors = dataLogin.errors;

      if (errors.length > 0) {
        res.render("otp", { dataLogin: errors, emailId: req.session.emailId });
      } else {
        res.render("changePassword", {
          dataLogin: [],
          emailId: req.session.emailId,
        });
      }
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }




  //get changetPassword request
  async changePassword(req, res) {
    try {
      res.render("changePassword", {
        dataLogin: [],
        emailId: req.session.emailId,
      });
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }




  //post changePassword request
  async postchangepassword(req, res) {
    try {
      const data = req.body;
      const dataLogin = validationResult(req);
      const errors = dataLogin.errors;
      if (errors.length > 0) {
        res.render("changePassword", { dataLogin: errors, data });
      } else {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        await User.updateOne(
          { email: req.session.emailId },
          { $set: { password: req.body.password } }
        );
        req.session.destroy();
        res.redirect("/login");
      }
    } catch (error) {
      response.httpResponse(
        res,
        statusCode.bad_request,
        response_status.failure,
        error.message
      );
    }
  }
}

module.exports = new signupController();
