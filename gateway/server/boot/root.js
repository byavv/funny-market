"use strict"
module.exports = function (app) {
    const router = app.loopback.Router();
    const User = app.models.User;

    const loginPath = app.get("loginPath") || "/login";
    const logoutPath = app.get("logoutPath") || "/logout";

    router.post(loginPath, (req, res, next) => {
        let email = req.body.email
            , password = req.body.password
            , username = req.body.username
            ;

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

    router.post(logoutPath, (req, res, next) => {
        if (!!req.accessToken) {
            User.logout(req.accessToken.id, (err, result) => {
                if (err) throw err;
                return res.sendStatus(200);
            });
        } else {
            return res.sendStatus(400);
        }
    });
    app.use('/auth', router);
};
