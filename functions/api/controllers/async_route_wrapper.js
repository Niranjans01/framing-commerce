const Redirect = require("./redirect");

module.exports = function (fn) {
  return (req, res, next) => {
    fn(req)
      .then(data => {
        if (data instanceof Redirect) {
          return res.redirect(301, data.url);
        } else {
          return res.status(200).json(data);
        }
      })
      .catch(next);
  }
}
