const messages = {
  emailNotFound:
    "This email does not exist in our community.Please check it out or contact to P.O.",
  emailAlreadyVerified: "Upsss seems like this email is already verified.",
  emailOtpSend:
    "OTP has been sent to your registered email address. Please verify the OTP to use app.",
  otpEnteredIncorrect: "You have entered an incorrect OTP.",
  otpExpired:
    "Your OTP has expired. Please generate a new OTP by clicking on resend OTP button.",
  otpVerifiedSuccessfully: "OTP verified successfully.",
};

const response_status = {
  success: 1,
  failure: 0,
};
const statusCode = {
  ok: 200,
  bad_request: 400,
  internal_server_error: 500,
};

module.exports = { messages, response_status, statusCode };
