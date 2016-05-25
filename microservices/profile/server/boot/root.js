var async = require('async');

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

  router.post("/profiles/signup", (req, res) => {
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
        //  Profile.create({ userId: user.id }, callback);
      },
    ], (err, profile) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(200).send(profile);
      }
    })
  })

  router.post("/update", (req, res) => {

  });

  app.use(router);
}
