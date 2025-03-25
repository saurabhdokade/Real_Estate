import { Router } from "express";
import {
  changeCurrentPassword,
  logoutUser,
  registerUser,
  loginUser,
  getCurrentUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes.....

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").put(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-userDetails").put(verifyJWT, updateAccountDetails);

export default router;
