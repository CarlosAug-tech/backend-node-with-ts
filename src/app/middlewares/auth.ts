import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import authConfig from "../../config/auth";

// interface IMiddlewareRequest extends Request {
//   userId: string;
// }

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ error: "Token not provided" });
  }

  if (!authConfig.secret) {
    return res.status(400).json({ error: "" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded: any = await jwt.verify(token, authConfig.secret);
    // @ts-ignore
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid" });
  }
};
