import { getUser } from "./auth.js";

async function authMiddleware(req, res, next) {
  const token = req.cookies?.uid;

  if (!token) return res.json({ authenticated: false });

  const user = getUser(token);
  if (!user) return res.json({ authenticated: false });

  req.user = user;
  next();
}

export default authMiddleware;
