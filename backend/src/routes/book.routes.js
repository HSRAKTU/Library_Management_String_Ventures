import { Router } from "express";
import { addBook } from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminCheck.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

//open routes
 // get all books

//secured routes
router.route("/add").post(verifyJWT,verifyAdmin,
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    addBook)

export default router;