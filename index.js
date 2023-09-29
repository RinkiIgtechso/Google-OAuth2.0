const express = require('express');
const path = require('path');
const passport = require("passport");
const session = require ('express-session');
const app = express();
require("./auth");
app.use(express.json());
app.use(express.static (path.join(__dirname, 'client')));

function isLoggedIn(req, res, next){
    req.user ? next() : res.sendStatus(401);
}

app.get("/", (req, res)=>{
    res.sendFile('index.html', { root: __dirname })
});

app.use(session({
  secret: 'rinkihere',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure'
    })
);

app.get("/auth/protected", isLoggedIn, (req, res) => {
    let name = req.user.displayName; 
    res.send(`Hello ${name}`);
})

app.get("/auth/google/failure", (req, res) => {
    res.send("Something went wrong!");
})

app.use('/auth/logout', (req, res) => {
    req.session.destroy();
    res.send("See you again!");
})

app.listen(5000, ()=>{
    console.log(`Listening on port no 5000`);
})
