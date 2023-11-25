import bcrypt from "bcrypt";
import validate from "../validation/validation.js";
import { v4 as uuid } from "uuid";
import { getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation, usernameValidation } from "../validation/user-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({ where: { username: user.username } });

  if (countUser > 0) {
    throw new ResponseError(409, "Another user with this username already exist.");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const token = uuid().toString();

  return prismaClient.user.create({
    data: {
      username: user.username,
      password: user.password,
      phonenumber: user.phonenumberForm.number,
      token,
      profile: { create: { name: user.name } },
      cart: { create: {} },
    },
    select: {
      id: true,
      username: true,
      phonenumber: true,
      token: true,
      profile: { select: { name: true, address: true, avatar: true } },
      cart: { select: { id: true, totalPrice: true, username: true, createdAt: true, updatedAt: true, cartItems: true } },
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: { username: loginRequest.username },
    select: { username: true, password: true, profile: { select: { address: true, avatar: true, name: true } } },
  });

  if (!user) {
    throw new ResponseError(401, "Username or password invalid!");
  }

  const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

  if (!isPasswordValid) {
    throw new ResponseError(401, "Username or password invalid!");
  }

  const token = uuid().toString();

  return await prismaClient.user.update({ where: { username: user.username }, data: { token }, select: { token: true } });
};

const get = async (token) => {
  if (token) {
    token = validate(getUserValidation, token);

    const user = await prismaClient.user.findFirst({
      where: { token },
      select: {
        username: true,
        phonenumber: true,
        profile: { select: { address: true, avatar: true, name: true } },
        cart: { select: { id: true, totalPrice: true, username: true, createdAt: true, updatedAt: true, cartItems: true } },
      },
    });

    if (!user) {
      throw new ResponseError(401, "Unauthorized!");
    }

    return user;
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

  const data = {};

  if (user.username) {
    data.username = user.username;
  }

  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  if (user.name) {
    data.name = user.name;
  }

  return prismaClient.user.update({
    where: { id: user.id },
    data: {
      username: data.username,
      password: data.password,
      profile: { update: { name: data.name } },
    },
    select: { username: true, profile: { select: { address: true, avatar: true, name: true } } },
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
