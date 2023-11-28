import { prismaClient } from "../app/database.js";
import { verifyToken } from "../utils/index.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ errors: "Unauthorized" }).end();
  } else {
    const decoded = verifyToken(token);

    if (decoded.error) {
      res.status(422).json({ errors: decoded.error }).end();
    }

    const user = await prismaClient.user.findUnique({ where: { username: decoded.username }, include: { cart: true, profile: true } }).catch(() => {
      res.status(401).json({ errors: "Unauthorized" }).end();
    });

    req.user = user;

    next();
  }
};
