exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.i_name;
      var pass= post.i_password;
      var mail= post.i_email;
      console.log(name);
      var sql = "INSERT INTO user (nickname , email, password) VALUES ('" + name + "','" + mail + "','" + pass + "')";

      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};
/*######################################################################################################################*/
exports.login = function(req, res){
   var message = '';
   var sess = req.session;

   if(req.method == "POST"){
      var post  = req.body;
      var mail= post.c_name;
      var pass= post.c_password;

      var sql="SELECT id, nickname FROM user WHERE email='"+mail+"' and password = '"+pass+"'";
      db.query(sql, function(err, results){
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('menu.ejs');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('menu.ejs',{message: message});
         }

      });
   } else {
      res.render('menu.ejs',{message: message});
   }

};
//#############################################################################################################################
