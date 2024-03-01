import Users from "../db/users";
import ApiError from "../error/ApiError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default (router) => {
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({
      email: email,
    });
    if (!user) {
      throw new ApiError(
        "Incorrect email or password",
        401,
        "UserOrPasswordIncorrect"
      );
    }
    const passwordConfirmed = await bcrypt.compare(password, user.password);
    if (passwordConfirmed) {
      const UserJson = user.toJSON();
      const token = jwt.sign(UserJson, process.env.JWT_SECRET);
      res.json({
        token: `Bearer ${token}`,
        user: UserJson,
      });
    } else {
      throw new ApiError(
        "Incorrect email or password",
        401,
        "UserOrPasswordIncorrect"
      );
    }
  });
};
