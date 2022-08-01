CREATE TABLE IF NOT EXISTS `users` (
`user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-
INSERT INTO `users` (`user_id`, `username`, `password`, `email`) VALUES
(2, 'admin', 'admin', 'admin'),
(3, 'user', 'user', 'user');

--
ALTER TABLE `users`
 ADD PRIMARY KEY (`user_id`);

--
ALTER TABLE `users`
MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;

// login user
router.post('/login', (req, res)=>{
    if(req.body.Username == credential.Username && req.body.password == credential.password){
        req.session.email = req.body.email;
        res.redirect('/route/patientrecords.dashboard');
        //res.end("Login Successful...!");
    }else{
        res.end("Invalid Username")
    }
});

// route for patientrecord.dashboard
router.get('/patientrecord.dashboard', (req, res) => {
    if(req.session.user){
        res.render('patientrecord.dashboard', {user : req.session.user})
    }else{
        res.send("Unauthorize User")
    }
})

// route for logout
router.get('/logout', (req ,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error")
        }else{
            res.render('Database', { title: "CareWare", logout : "logout Successfully...!"})
        }
    })
})
