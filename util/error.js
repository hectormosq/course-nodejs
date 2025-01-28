module.exports = (err, req, res, next) => {
  console.log(err);
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
};
