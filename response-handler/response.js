class httpResponse {

  //httpresponse to be sent
  httpResponse(res, statusCode, status, message, data) {
    return res
      .status(statusCode)
      .json({ status: status, message: message, Data: data });
  }


  // otp generation function
  otpgenerator() {
    console.log("otpgeneator called");
    return Math.floor(Math.random() * 10000 + 1);
  }
}

module.exports = new httpResponse();
