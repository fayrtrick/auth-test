import { NextApiRequest, NextApiResponse } from "next/types";

import { prisma } from "../../../server/db/client";

const logoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // try {
  //   const parsedBody = TokenSchema.safeParse(req.body);
  //   if (!parsedBody.success) {
  //     return res.status(400).send({
  //       message: "Invalid request body.",
  //     });
  //   }
  // const { data } = parsedBody;
  //   const userToken = await prisma.userToken.findFirst({
  //     where: { token: data.refreshToken },
  //   });
  //   if (userToken) {
  //     await prisma.userToken.delete({ where: { id: userToken.id } });
  //   }
  //   return res.status(200).send({ message: "Logged out successfully." });
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).send({
  //     message: "Error while disconnecting user.",
  //   });
  // }
};

export default logoutHandler;
