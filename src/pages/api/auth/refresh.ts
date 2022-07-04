import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next/types";

import { verifyRefreshToken } from "../../../utils/token";

const refreshHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token) {
    return res.status(400).send({ message: "The token are missing" });
  }
  await verifyRefreshToken(refresh_token).then(
    ({ tokenDetails }: JwtPayload) => {
      const accessToken = jwt.sign(
        {
          email: tokenDetails.email,
        },
        process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
        { expiresIn: "14m" }
      );
      res.setHeader(
        "Set-Cookie",
        serialize("access_token", accessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 60 * 14,
          path: "/",
        })
      );

      return res.status(200).send({ token: accessToken });
    }
  );
};

export default refreshHandler;
