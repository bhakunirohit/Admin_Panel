const passport = require("passport");
class authenticate {
    async userAuthentication  (req, res, next)  {
       
        if (req.session.user || req.session.passport != undefined) {
            next();
            console.log('inside session');
        }

        // else if(req.session.passport != undefined){
        //     console.log(req.session.passport.user.email,"we are here");
        //     if(req.session.passport.user.email)
        //     {
        //         next();
        //     }
        // }
        else {
            res.redirect('/login');
            console.log(req.session,'session');
            console.log('inside homepage than login');
        }
    }
    
    async sessionAuthentication (req,res,next){
        if (req.session.emailId) {
            next();
        }
        else {
            res.redirect('/password');
        }
    }
}


module.exports = new authenticate();