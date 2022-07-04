import jwt from "jsonwebtoken";
import { prisma } from "../server/db/client";

const withProtect = (handler: any) => {
  return async (req: any, res: any) => {
    if (
      !(
        req.headers.authorization ||
        req.headers.authorization?.startsWith("Bearer ")
      )
    ) {
      return res.status(403).json({ error: "No authorization" });
    }

    const token = req.headers.authorization.split("Bearer ")[1];
    if (!token) return res.status(403).json({ message: "No token found !" });

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_PRIVATE_KEY as string
      ) as any;
      const user = await prisma.user.findUnique({
        where: {
          email: decodedToken.email,
        },
      });

      if (!user) return res.status(403).json({ error: "Invalid token !" });

      req.user = user;

      return handler(req, res);
    } catch (err) {
      return res.status(403).json({ message: "Invalid token !" });
    }
  };
};

export default withProtect;
