const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut, reset, newpassword, forgetpassword,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);
router.post("/reset", reset);
router.post("/newpassword/:token/:id", newpassword);
router.get("/forgetpassword/:token/:id", forgetpassword)
module.exports = router;
