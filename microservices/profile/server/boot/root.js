const async = require('async')
  , debug = require("debug")('profile');

module.exports = function (app) {
  var router = app.loopback.Router();
  var User = app.models.User;
  var Role = app.models.role;
  var RoleMapping = app.models.RoleMapping;
  var Profile = app.models.profile;

  router.get('/', app.loopback.status());

  router.post("/profiles/me", (req, res) => {
    return res.status(200).send("HI");
  });

  router.post("/auth/signup", (req, res) => {
    debug("Creating new user", req.body.username)
    async.waterfall([
      (callback) => {
        User.create(req.body, callback)
      },
      (user, callback) => {
        Role.findOne({ where: { name: 'user' } }, (err, role) => {
          callback(err, user, role)
        })
      },
      (user, role, callback) => {
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: user.id
        }, (err) => {
          callback(err, user);
        });
      },
      (user, callback) => {
        user.profile.create({}, callback);
      },
    ], (err, profile) => {
      if (err) {
        if (err.name == 'ValidationError') {
          res.status(400).send(err.details)
        } else {
          throw err;
        }
      } else {
        return res.status(200).send(profile);
      }
    });
  });

  router.post('/auth/login', (req, res, next) => {
    let email = req.body.email
      , password = req.body.password
      , username = req.body.username
      ;
    debug("Login user", (email || username))
    if ((email || username) && password) {
      User.login({
        email: email,
        password: password,
        username: username
      }, 'user', (err, token) => {
        if (err) {
          return res.status(err.statusCode).json({
            title: err.code
          });
        }
        return res.status(200).json({
          name: req.body.username,
          token: token.id
        });
      });
    } else {
      return res.sendStatus(400);
    }
  });

  router.post('/auth/logout', (req, res, next) => {
    if (!!req.accessToken) {
      User.logout(req.accessToken.id, (err, result) => {
        if (err) throw err;
        return res.sendStatus(200);
      });
    } else {
      return res.sendStatus(400);
    }
  });

  app.use(router);
};
