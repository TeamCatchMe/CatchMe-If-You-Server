import jwt from "jsonwebtoken";
import config from "../config";

export default (req, res, next) => {
  // Get token from header
  const token = req.header("token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    var hello = "true";
    req.body.user = decoded.user;
    // req.body.isAuth = "true";
    console.log("authtest에서!!2222222 ", req.body);
    // res.locals.user = decoded.user;
    // res.locals.authenticated = !req.user.anonymous;
    next();
  } catch (err) {
    // req.body.isAuth = "false";
    res.status(401).json({ msg: "Token is not valid" });
  }
};
