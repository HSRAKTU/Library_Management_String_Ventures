import { Router } from "express";
import { checkUsernameAvailability, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/checkUsername").get(checkUsernameAvailability);

//secured routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refreshAccessToken").post(refreshAccessToken);
router.route("/currentUser").get(verifyJWT,getCurrentUser)

export default router;

