const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
    //Sign Up

    app.post('/api/account/signup', (req, res, next) =>{
        const { body } = req;
        const {
            firstName,
            lastName,
            password
        } = body;
        let {
            email
        } = body;

        if (!firstName) {
            return res.send({
                success: false,
                message: 'Error: First name cannot be blank.'
            });
        }

        if (!secondName) {
            return res.send({
                success: false,
                message: 'Error: Second name cannot be blank.'
            });             
        }

        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank.'
            });
                            
        }

        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });             
        }

        email = email.toLowerCase();
        
        //Verify email doesn't exist
        User.find({
            email: email
        },(err, previousUsers) =>{
            if(err) {
                res.end('Error: Server error');
        }else if(previousUsers.length > 0) {
            res.end('Errr: Account already exist.');
        }

        //Save the new user
        const newUser = new User();

        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.pasword = newUser.generateHash(password);
        newUser.save((err, user) =>{
            if(err){
                res.end({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            res.end({
                success: true,
                message: 'Signed up'
            });
        });
        });
    });

    //Sign in
    app.post('/api/account/signin', (req, res, next) =>{
        const { body } = req;
        const {
            password
        } = body;
        let {
            email
        } = body;

        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank.'
            });                
        }

        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });             
        }

        email = email.toLowerCase();

        user.find({
            email: email
        }, (err, users)=>{
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: server error'
                });
            }
            if(users.length != 1){
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            }

            const user = users[0];
            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            }
            //Otherwise correct user
            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) =>{
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: server error'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Valid sign in',
                    token: doc._id
                });
            });
        });

    });
    
    //Login
    app.get('/api/account/verify', (req, res, next) =>{
        // Get the token
        const { query } = req;
        const { token } = query;

        //Verify the token is one of the kind and it's not deleted.
        Usersession.find({
            _id: token,
            isDeleted: false
        }, (err, sessions) =>{
            if(err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }

            if(sessions.length !=1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            }else{
                return res.send({
                    success: true,
                    message: 'Good'
                });
            }
        });
    });

    //Logout
    app.get('/api/account/logout', (req, res, next) =>{
        // Get the token
        const { query } = req;
        const { token } = query;

        //Verify the token is one of the kind and it's not deleted.
        Usersession.findOneUpdate({
            _id: token,
            isDeleted: false
        }, {
            $set:{
                isDeleted:true}
        }, null, (err, sessions) =>{
            if(err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }

                return res.send({
                    success: true,
                    message: 'Good'
                });
        });
    });
}