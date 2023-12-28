import { validate } from "uuid";
import { prismaClient } from "../app/database.js";
import { verifyToken } from "../utils/index.js";

export const guestMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const guestUserId = req.query.guest_uid;

  if (token) {
    const decoded = verifyToken(token);

    if (decoded.error) {
      res.status(422).json({ errors: decoded.error }).end();
    } else {
      const user = await prismaClient.user.findUnique({ where: { username: decoded.username }, include: { cart: true, profile: true } }).catch(() => {
        res.status(401).json({ errors: "Unauthorized" }).end();
      });

      req.user = user;

      next();
    }
  } else {
    if (!validate(guestUserId)) {
      res.status(401).json({ errors: "Unauthorized" }).end();
    } else {
      req.guestUserId = guestUserId;

      next();
    }
  }
};
