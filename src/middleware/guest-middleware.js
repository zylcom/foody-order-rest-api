import { validate } from "uuid";
import { prismaClient } from "../app/database.js";

export const guestMiddleware = async (req, res, next) => {
  const token = req.get("Authorization");
  const guestUserId = req.query.guest_uid;

  if (token) {
    const user = await prismaClient.user.findFirst({ where: { token }, include: { cart: true, profile: true } });

    if (!user) {
      res.status(401).json({ errors: "Unauthorized" }).end();
    } else {
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
