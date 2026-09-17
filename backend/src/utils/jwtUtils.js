import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpiresIn,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtAccessSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwtRefreshSecret);
};
