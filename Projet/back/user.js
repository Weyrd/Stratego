exports.leaderboard = function(req, res){
   message = '';
   var sql = "SELECT * FROM leaderboard ORDER BY leaderboard.score DESC";
   var query = db.query(sql, function(err, result) {
     console.log(result);
     global.resultArray = Object.values(JSON.parse(JSON.stringify(result)))
     console.log(result[1].nickname);
     res.render('leaderboard',resultArray);
     resultArray.forEach((v) => console.log(v));
   });
};


/*######################################################################################################################*/
exports.login = function(req, res){
   var message = '';
   var sess = req.session;

   console.log("fonction");

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.c_name;
      var pass= post.c_password;

      var sql="SELECT nickname, password FROM users WHERE nickname='"+name+"' and password = '"+pass+"'";
      db.query(sql, function(err, results){
         if(results.length){
            console.log("test");
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
           // res.redirect('menu.ejs');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('menu.ejs',{message: message});
         }
      });
   } else {
      message.log("else");
      res.render('menu.ejs',{message: message});
   }

};
//#############################################################################################################################
exports.score = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name = post.;
      var score = post.score;

      var sql = "INSERT INTO leaderboard (nickname, score) VALUES ('" + name + "', score')";

      var query = db.query(sql, function(err, result) {
        message = "Succesfully! Your Score has been added.";
        res.render('leaderboard',{message: message});
      });

   } else {
      res.render('leaderboard');
   }
};
