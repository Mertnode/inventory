const express = require('express')
const { registerUser, loginUser, logoutUser, getUser, loginStatus, updateUser,changePassword, forgotpassword} = require('../controllers/userController')
const protect = require('../middleware/authMiddlware')
const router = express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/logout",logoutUser)
router.get("/getuser",protect,getUser)
router.get("/loggeddin",loginStatus)
router.patch("/updateuser",protect,updateUser)
router.patch("/changepassword",protect,changePassword)
router.post("/forgotpassword",forgotpassword)
module.exports = router