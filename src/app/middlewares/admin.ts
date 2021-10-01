import { NextFunction, Request, Response } from "express";
import prisma from "../../lib/prisma";

export default async (req: Request, res: Response, next: NextFunction) => {
  const user = await prisma.user.findUnique({
    where: {
      // @ts-ignore
      id: req.userId,
    },
  });

  if (!user) {
    return res.status(400).json({ error: "User not provided" });
  }

  if (user.email !== process.env.SUPER_USER) {
    return res.status(400).json({ error: "You dont have permission" });
  }

  return next();
};
