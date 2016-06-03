module.exports = (app, cb) => {
    var User = app.models.User;
    var Role = app.models.role;
    var RoleMapping = app.models.RoleMapping;
    Role.find({}, (err, roles) => {
        if (!roles || (roles && roles.length < 1)) {
            Role.create([
                { name: 'user', can: ['read'] },
                { name: 'admin', can: ['read', 'write'] }
            ], (err, roles) => {
                if (err) throw err;

                console.log("CREATED TEST ROLES:", roles.map(role => role.name));

                User.find({}, (err, users) => {
                    if (!users || (users && users.length < 1)) {
                        User.create([
                            { // user
                                username: 'potter',
                                email: 'harry@potter.com',
                                password: '111'
                            },
                            { // admin
                                username: 'ron',
                                email: 'ron@weasley.com',
                                password: '222'
                            }                       
                        ], (err, users) => {
                            console.log("CREATED TEST USERS: ", users.map(user => user.username));
                            if (err) throw err;
                            roles[0].principals.create({
                                principalType: RoleMapping.USER,
                                principalId: users[0].id
                            }, (err, principal) => {
                                if (err) throw err;
                            });
                            roles[1].principals.create({
                                principalType: RoleMapping.USER,
                                principalId: users[1].id
                            }, (err, principal) => {
                                if (err) throw err;
                                cb();
                            });
                        });
                    }
                });
            });
        } else {
            cb();
        }
    });
};