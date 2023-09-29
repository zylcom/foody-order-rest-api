import bcrypt from "bcrypt";
import validate from "../validation/validation.js";
import { v4 as uuid } from "uuid";
import { getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({ where: { username: user.username } });

  if (countUser > 0) {
    throw new ResponseError(400, "User already exist!");
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
      username: true,
      phonenumber: true,
      token: true,
      profile: { select: { name: true, address: true, avatar: true } },
      cart: { select: { cartItems: true } },
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

const get = async (username) => {
  username = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: { username },
    select: {
      username: true,
      phonenumber: true,
      profile: { select: { address: true, avatar: true, name: true } },
      cart: { select: { cartItems: { include: { product: true } } } },
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found!");
  }

  return user;
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
  username = validate(getUserValidation, username);

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
