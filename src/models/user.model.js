import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
          },
          password: {
            type: String,
            required: [true,"password field id required"],
          },
          number:{
            type:String,
            maxlength:15,
            required:true
          },
          coverImage:{
            type:String // cloudinary image
          },
          refreshToken:{
            type:String
          },
          accountVerified:{
            type:Boolean,
            default:false
          },
          verificationCode:{
            type:Number
          },
          verificationCodeExpire:{
            type:Date
          },
          resetPasswordToken:{
            type:String
          },
          resetPasswordExpire:{
            type:Date
          }
    },
    {timestamps:true}
)

// code for hashing password before saving password in databasee

userSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password,10)
  next();
})

// code for comparing password

userSchema.methods.isPasswordCorrect = async function (password){
   return await bcrypt.compare(password,this.password)
} 

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id: this._id,
      email: this.email
    },
    process.env.ACCESS_TOKEN_SCRETE,
    {
       expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

// code for gen erating refresh token

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
       expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

// code for generating verification code 

userSchema.methods.generateVerificationCode = function () {
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, 0);

    return parseInt(firstDigit + remainingDigits);
  }
  const verificationCode = generateRandomFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;

  return verificationCode;
};


export const User = mongoose.model("User",userSchema);