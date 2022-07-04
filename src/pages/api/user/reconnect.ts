import { NextApiRequest, NextApiResponse } from "next/types";

import withProtect from "../../../middleware/withProtect";

const reconnectHandler = async (req: any, res: NextApiResponse) => {
  const user: object = req.user;

  return res.status(200).send(user);
};

export default withProtect(reconnectHandler);
