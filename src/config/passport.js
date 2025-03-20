// import {app} from "../app.js";
// import passport from "passport";
// import session from "express-session";
// import OAuth2Strategy from "passport-google-oauth20";
// import { User } from "../models/user.model.js";

// OAuth2Strategy.Strategy;

// // setup session

// app.use(session({
//     secret:"123456789",
//     resave:false,
//     saveUninitialized:true
// }))

// // setup passport

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(
//     new OAuth2Strategy({
//         clientID : process.env.GOOGLE_CLIENT_ID,
//         clientSecret : process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL : "/auth/google/callback",
//         scope:["profile","email"]
//     },
//      async (accessToken,refreshToken,profile,done)=>{
//         try {
            
//         } catch (error) {
            
//         }
//      }
//   )
// )

