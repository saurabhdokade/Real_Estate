import {asyncHandler} from "../utils/asynchHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async(userId)=>{
  try {
     const user = await User.findById(userId);
     const accessToken = user.generateAccessToken()
     const refreshToken = user.generateRefreshToken()
     // now we put refresh token to database
     user.refreshToken = refreshToken;
     await user.save({validateBeforeSave:false});
     // now return accessToken and refreshToken
     return {accessToken, refreshToken};
  } catch (error) {
      throw new ApiError(500,"Somthing went wrong while generating refresh and access token")    
  }
}


const registerUser = asyncHandler(async (req,res)=>{
    // get user detail from frontend

    const  {fullName,email,password,number}   = req.body;

    console.log("comming from req.body:",req.body);

    // check details is comming or not

    if (
      [fullName,email,password,number].some((field)=>
        field?.trim === ""
      )
    ){
      throw new ApiError(400,"All fields are required")
    }
    // check if user already exist

    const  existedUser = await User.findOne({
      $or:[{fullName},{email}]
    })

    if(existedUser){
      throw new ApiError(409,"User with email or fullname already existed")
    }

    // create user object - create entry in db
    const user = await User.create({
      fullName,
      email,
      password,
      number
    })
    // remove password and refresh token from response
    //check for user creation
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    if(!createdUser){
      throw new ApiError(500,"Somthing went wrong while regestiring user")
    }
    //return resp
    
    return res.status(201).json(
      new ApiResponse(200,createdUser,"user registered successfully")
    )
})


const loginUser = asyncHandler(async(req,resp)=>{
     //get data from (req.body)
  const { userName, email, password } = req.body;

  //make login on basic of username,email
  if (!(userName || email)) {
    throw new ApiError(401, "Username or email is not present");
  }
  //check user is present or not and if not send error message
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user does't exiest with this userName and email");
  }

  //check password is correct or not
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is not Valid");
  }
  //if password is correct provide access and refresh token

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //send cookie
  // for sending cookies we have to desine some options
  const options = {
    // now these cookies can only modified from server
    httpOnly: true,
    secure: true,
  };

  //send response

  return resp
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: accessToken,
          refreshToken,
          loggedInUser,
        },
        "user loggedIn successfully"
      )
    );
})


const logoutUser = asyncHandler(async(req,res)=>{
     
     await User.findByIdAndUpdate(
      req.user._id,
      {
        $set:{
          refreshToken:undefined
        }
      },
      {
        new:true
      }
    )
    const options = {
      httpOnly:true,
      secure:true
    }

    return res
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new ApiResponse(200,{},"user loged-out successfully !!!! "))
})


export {registerUser, loginUser,logoutUser};