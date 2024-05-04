// This takes away the need to write req.session.user and passes the user to all pages.
const passUserToView = (req, res, next) => {
    res.locals.user = req.session.user ? req.session.user : null;
    next();
  };
  
  module.exports = passUserToView;