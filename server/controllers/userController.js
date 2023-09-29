const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'priyanshu_20262@ldrp.ac.in',
    pass: 'priyanshu2401'
  },
});
transporter.verify().then(console.log).catch(console.log);

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

module.exports.reset = (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  let id
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: email }).then(user => {
      if (!user) {
        return res.json({ msg: "dose not find email ", status: false });
      }
      id = user._id
      console.log(id);
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    }).then(result => {
      res.status(201).json({ status: true, result });
      transporter.sendMail({
        to: req.body.email,
        from: 'priyanshu_20262@ldrp.ac.in',
        subject: 'Reset Form Link',
        html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}/${id}">Link</a> To set password</p>
            `
      })
    }).catch(err => { console.log(err) });
  })
}

module.exports.newpassword = async (req, res, next) => {
  const { password } = req.body;
  const { token, id } = req.params;
  console.log(password);
  console.log(token);
  console.log(id);
  // const passwordtoken = req.params.passwordtoken;
  let resetUser;
  try {
    await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }, _id: id }).then(user => {
      resetUser = user;
      console.log(resetUser);
      console.log(password);
      return bcrypt.hash(password, 12);
    }).then(hashedpassword => {
      console.log(hashedpassword);
      resetUser.password = hashedpassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    }).then(result => {
      res.status(201).json({ status: 201, result });
    }).catch(err => { console.log(err) });

  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
}






module.exports.forgetpassword = async (req, res, next) => {
  const { token, id } = req.params
  console.log(token, id);
  try {
    await User.findOne({ _id: id, resetToken: token, resetTokenExpiration: { $gt: Date.now() } }).then(user => {
      if (user) {
        res.status(201).json({ status: 201, user });
      } else {
        res.status(401).json({ status: 401, msg: "User id is required " });
      }
    });

  } catch (error) {
    res.status(401).json({ status: 401, error });

  }
}