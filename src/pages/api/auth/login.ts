import { NextApiRequest, NextApiResponse } from "next/types";
import { serialize } from "cookie";
import argon2 from "argon2";

import { prisma } from "../../../server/db/client";
import { UserLoginSchema } from "../../../utils/models/auth";
import { generateTokens } from "../../../utils/token";

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const parsedBody = UserLoginSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).send({
        message: "Invalid request body.",
      });
    }

    const { data } = parsedBody;

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return res.status(404).send({
        message: "No valid user found.",
      });
    }

    const passwordsMatch = await argon2.verify(user.password, data.password);
    if (!passwordsMatch) {
      return res.status(400).send({
        message: "Passwords don't match.",
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    res.setHeader("Set-Cookie", [
      serialize("access_token", accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 10 * 1,
        path: "/",
      }),
      serialize("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      }),
    ]);

    return res.status(200).json({ message: "Logged in successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error while connecting the user.",
    });
  }
};

export default loginHandler;
