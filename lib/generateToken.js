import jwt from "jsonwebtoken";

export const generateToken = (user, statusCode, res) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d"; // Default to 1 day if not set in env
  if (user.role === "admin") {
    expiresIn = "6h";
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: expiresIn }
  );

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};
