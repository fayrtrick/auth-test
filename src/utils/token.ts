import { User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

import { prisma } from "../server/db/client";

type RefreshToken = {
  tokenDetails?: string | JwtPayload;
  error: boolean;
  message: string;
};

export const generateTokens = async (user: User) => {
  try {
    const payload = { email: user.email };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
      { expiresIn: "14m" }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
      { expiresIn: "30d" }
    );

    const userToken = await prisma.userToken.findFirst({
      where: { userID: user.id },
    });

    if (userToken) {
      await prisma.userToken.delete({
        where: { id: userToken.id },
      });
    }

    await prisma.userToken.create({
      data: { userID: user.id, token: refreshToken },
    });
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const verifyRefreshToken = async (
  refreshToken: string
): Promise<RefreshToken> => {
  const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY as string;

  return new Promise(async (resolve, reject) => {
    const doc = await prisma.userToken.findFirst({
      where: { token: refreshToken },
    });
    if (!doc) {
      return reject({ error: true, message: "Invalid refresh token." });
    }
    jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
      if (err) return reject({ error: true, message: "Invalid refresh token" });
      resolve({
        tokenDetails,
        error: false,
        message: "Valid refresh token",
      });
    });
  });
};
