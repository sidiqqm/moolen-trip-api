import jwt from "jsonwebtoken";
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is invalid" });
    req.userId = payload.id;
    next();
  });
};
export default verifyToken;
