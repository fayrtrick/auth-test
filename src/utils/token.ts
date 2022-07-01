import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

import { prisma } from "../server/db/client";

const generateTokens = async (user: User, xsrfToken: string) => {
  try {
    const payload = { email: user.email, xsrfToken };
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

export default generateTokens;
