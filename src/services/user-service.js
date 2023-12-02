import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validate from "../validation/validation.js";
import { v4 as uuid } from "uuid";
import { loginUserValidation, registerUserValidation, updateUserValidation, usernameValidation } from "../validation/user-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { verifyToken } from "../utils/index.js";

const secretKey = process.env.JWT_SECRET_KEY;

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({ where: { username: user.username } });

  if (countUser > 0) {
    throw new ResponseError(409, "Another user with this username already exist.");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const registeredUser = await prismaClient.user.create({
    data: {
      username: user.username,
      password: user.password,
      phonenumber: user.phonenumberForm.number,
      profile: { create: { name: user.name } },
      cart: { create: {} },
    },
    select: {
      id: true,
      username: true,
      phonenumber: true,
      profile: { select: { name: true, address: true, avatar: true } },
      cart: { select: { id: true, totalPrice: true, username: true, createdAt: true, updatedAt: true, cartItems: true } },
    },
  });

  const token = jwt.sign({ username: registeredUser.username }, secretKey, { expiresIn: "30m" });

  return { ...registeredUser, token };
};

const login = async (request) => {
  request = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: { username: request.username },
  });

  if (!user) {
    throw new ResponseError(401, "Username or password invalid!");
  }

  const isPasswordValid = await bcrypt.compare(request.password, user.password);

  if (!isPasswordValid) {
    throw new ResponseError(401, "Username or password invalid!");
  }

  const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: "30m" });

  return { token };
};

const get = async (token) => {
  if (token) {
    const decoded = verifyToken(token);

    if (decoded.error) {
      throw new ResponseError(422, decoded.error);
    } else {
      const user = await prismaClient.user
        .findUnique({
          where: { username: decoded.username },
          select: {
            username: true,
            phonenumber: true,
            profile: { select: { address: true, avatar: true, name: true } },
            cart: { select: { id: true, totalPrice: true, username: true, createdAt: true, updatedAt: true, cartItems: true } },
          },
        })
        .catch(() => {
          throw new ResponseError(401, "Unauthorized!");
        });

      return user;
    }
  } else {
    return { guestUserId: uuid().toString() };
  }
};

const update = async (request) => {
  const user = validate(updateUserValidation, request);

  const userCount = await prismaClient.user.count({ where: { id: user.id } });

  if (userCount !== 1) {
    throw new ResponseError(404, "User not found!");
  }

  return prismaClient.user.update({
    where: { id: user.id },
    data: {
      phonenumber: user.phonenumberForm?.number,
      profile: { update: { name: user?.name, address: user?.address } },
    },
    select: { id: true, username: true, phonenumber: true, profile: { select: { address: true, avatar: true, name: true } } },
  });
};

const logout = async (username) => {
  username = validate(usernameValidation, username);

  const user = await prismaClient.user.findUnique({ where: { username } });

  if (!user) {
    throw new ResponseError(404, "User not found!");
  }

  return prismaClient.user.update({ where: { username }, data: { token: null }, select: { username: true } });
};

export default {
  get,
  login,
  logout,
  register,
  update,
};
