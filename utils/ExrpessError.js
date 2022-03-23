class ExpressError extends Error {
   constructor(message = 'something went wrong', statusCode = 500) {
      super();
      this.message = message;
      this.statusCode = statusCode;
   }
}

module.exports = ExpressError;