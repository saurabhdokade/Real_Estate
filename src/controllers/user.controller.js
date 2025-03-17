import {asyncHandler} from "../utils/asynchHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";


const registerUser = asyncHandler(async (req,res)=>{
    // get user detail from frontend

    const {email,password} = req.body;
    
    if([email,password].some((field)=>
        {field?.trim() === ""})){
        throw new ApiError(400),"All fields are required"
    }

    const existedUser = User.findOne({
        $or:[{email},{username}]
    })

    if(existedUser){
        throw new ApiError(400,"User with email or username already exist")
    }

    // validation- not empty
    // check if user already exists :username, email
    
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


export {registerUser};