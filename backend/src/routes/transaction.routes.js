import { borrowBook, getUserTransactionHistory, returnBook } from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/borrow").post(verifyJWT,borrowBook)
router.route("/return").patch(verifyJWT,returnBook)
router.route("/history").get(verifyJWT,getUserTransactionHistory)
export default router