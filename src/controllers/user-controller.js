import userService from "../services/user-service.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);

    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const result = await userService.get(token);

    if (result.guestUserId) {
      res.status(201).set("Cache-Control", "private, max-age=3, must-revalidate").json({ data: result });
    } else {
      res.status(200).set("Cache-Control", "private, max-age=3, must-revalidate").json({ data: result });
    }
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const request = { ...req.body, id: req.user.id };

    const result = await userService.update(request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await userService.logout(req.user.username);

    res.status(200).json({ data: "Logged out!" });
  } catch (error) {
    next(error);
  }
};

export default { register, login, get, update, logout };
