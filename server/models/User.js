const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; //salt가 몇 자리인지
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  //저장하기 전에 하는 행동
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next(); //save로 넘어감
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err), cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  //jsonwebtoken을 이용해서 토큰 생성
  var user = this;
  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user.save(function (err, userInfo) {
    if (err) return cb(err), cb(null, userInfo);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  //토큰을 디코드
  jwt.verify(token, "secretToken", function (err, decoded) {
    //유저 아이디를 이용해 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

    user.findOne({ _id: decoded, token: token }, function (err, userInfo) {
      if (err) return cb(err);
      cb(null, userInfo);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
