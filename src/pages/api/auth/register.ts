import { NextApiRequest, NextApiResponse } from "next/types";
import argon2 from "argon2";

import { prisma } from "../../../server/db/client";
import { UserRegisterSchema } from "../../../utils/models/auth";

const registerHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const parsedBody = UserRegisterSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).send({
        message: "Invalid request body.",
      });
    }

    const { data } = parsedBody;

    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (userExists) {
      return res.status(400).send({
        message: "Email already in use.",
      });
    }

    const hashedPassword = await argon2.hash(data.password);
    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
    res.status(200).json({
      message: "User created.",
      user: { ...user, password: "" },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error while registering the user.",
    });
  }
};

export default registerHandler;
