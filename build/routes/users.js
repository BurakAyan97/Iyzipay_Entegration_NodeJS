"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _users = _interopRequireDefault(require("../db/users"));
var _ApiError = _interopRequireDefault(require("../error/ApiError"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = router => {
  router.post("/login", async (req, res) => {
    const {
      email,
      password
    } = req.body;
    const user = await _users.default.findOne({
      email: email
    });
    if (!user) {
      throw new _ApiError.default("Incorrect email or password", 401, "UserOrPasswordIncorrect");
    }
    const passwordConfirmed = await _bcryptjs.default.compare(password, user.password);
    if (passwordConfirmed) {
      const UserJson = user.toJSON();
      const token = _jsonwebtoken.default.sign(UserJson, process.env.JWT_SECRET);
      res.json({
        token: `Bearer ${token}`,
        user: UserJson
      });
    } else {
      throw new _ApiError.default("Incorrect email or password", 401, "UserOrPasswordIncorrect");
    }
  });
};
exports.default = _default;