import { Router } from "express";
import { addBook, deleteBook, getAllBooks, getBookById, updateBook } from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminCheck.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

//open routes
router.route("/getAll").get(getAllBooks)
router.route("/getById/:bookId").get(getBookById)
//secured routes
router.route("/add").post(verifyJWT,verifyAdmin,
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    addBook)

router.route("/update/:bookId").patch(verifyJWT,verifyAdmin,
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    updateBook)

router.route("/delete/:bookId").delete(verifyJWT,verifyAdmin,deleteBook)



export default router;