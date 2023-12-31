const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const winston = require("winston");
const crypto = require("crypto")
const Token = require("../models/tokenModel")
const {sendEmail} = require("../utils/sendEmail");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    logger.error("Validation Error: Please fill in all required fields");
    return res.status(400).json({ error: "Please fill in all required fields" });
  }
  if (password.length < 6) {
    logger.error("Validation Error: Şifre en az 6 karakter olmalıdır");
    return res.status(400).json({ error: "Şifre en az 6 karakter olmalıdır" });
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    logger.error("User Exists: Email has already been registered");
    return res.status(400).json({ error: "Email has already been registered" });
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;

    // Generate Token after user creation
    const token = generateToken(user._id);
    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 Day
      sameSite: "none",
      secure: true,
    });
    logger.info("User Registered: User registered successfully");
    return res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    logger.error("Invalid User Data: Invalid user data");
    return res.status(400).json({ error: "Invalid user data" });
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate user
  if (!email || !password) {
    logger.error("Validation Error: Please add email and password");
    return res.status(400).json({ error: "Please add email and password" });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    logger.error("User Not Found: User not found, please sign up");
    return res.status(400).json({ error: "User not found, please sign up" });
  }

  // User exists, check if the password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    const token = generateToken(_id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 Day
      sameSite: "none",
      secure: true,
    });
    logger.info("User Logged In: User logged in successfully");
    return res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    logger.error("Invalid Credentials: Invalid email or password");
    return res.status(400).json({ error: "Invalid email or password" });
  }
});

exports.logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  logger.info("User Logged Out: User logged out successfully");
  return res.status(200).json({ message: "Successfully Logged Out" });
});

exports.getUser = asyncHandler(async (req, res) => {
  // User.findById işlemi asenkron olduğu için await kullanmalısınız.
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;

    logger.info("User Info Retrieved: User information retrieved successfully");
    return res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    logger.error("User Not Found: Kullanıcı bulunamadı");
    return res.status(400).json({ error: "Kullanıcı bulunamadı" });
  }
});

// Get Login Status
exports.loginStatus = asyncHandler(async(req,res) => {
    const token = req.cookies.token
    if (!token) {
        return res.json(false)
    }
    // Verify Token
    const verified = jwt.verify(token,process.env.JWT_SECRET)
    if (verified) {
        return res.json(true)
    }
})

exports.updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if (user) {
      // Kullanıcıdan gelen güncelleme verilerini alın
      const { name, email, photo, phone, bio } = user;
  
      // Kullanıcı bilgilerini güncelleyin
      user.email = req.body.email || email;
      user.name = req.body.name || name;
      user.phone = req.body.phone || phone;
      user.photo = req.body.photo || photo;
      user.bio = req.body.bio || bio;
  
      // Kullanıcı bilgilerini kaydedin
      const updatedUser = await user.save();
  
      // Güncellenmiş kullanıcı bilgilerini yanıt olarak gönderin
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        photo: updatedUser.photo,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  exports.changePassword = asyncHandler(async (req,res) => {


    const user  = await User.findById(req.user_id)
    if (!user) {
      res.status(400).json({error:"Please add old and new password"})
    }
    //validate
    const {oldPassword,password} = req.body
    if(!oldPassword || password) (
      res.status(404).json({ error: "User not found" })
    )

    //check password old password matches password in DB\
    const passwordIsCorrect = await bcrypt.compare(oldPassword,user.password)

    //save new password
    if (user && passwordIsCorrect) {
      user.password = password
      await user.save()
      res.status(200).json({message:"password change successful"})
    } else {
      res.status(404).json({ error: "Old password is incorrect" })
    }
  })

exports.forgotpassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User does not exist" });
  }

  // create reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // save token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // Thirty minutes
  }).save();

  // construct reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // reset email
  const message = `
    <h2>Hello ${user.name}</h2>
    <p>Please use the URL below to reset your password</p>
    
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    
    <p>Regards...</p>
    <p>Pinvent Team</p>
  `;

  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    return res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Email not sent, please try again" });
  }
});

  //Reset Password
exports.resetPassword = asyncHandler(async (req,res) => {
  const {password} = req.body
  const {resetToken} = req.params

  // Hash token, then compare to Token in DB
  const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

  // Find Token DB
  const userToken = await Token.findOne({
    token:hashedToken,
    expiresAt: {$gt: Date.now()}
  })
  if (!userToken) {
    res.status(404).json({message:"Invalid or expired Token"})
    user.password = password
    await user.save()
    res.status(200).json({message:"Password Reset Successful, Please Login"})
  }

  //Find user
  const user = await User.findOne({_id: userToken.userId})
})