import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import prisma from "../../lib/prisma";
import authConfig from "../../config/auth";

class SessionController {
  async store(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        avatar: {},
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Password does not match" });
    }

    if (!authConfig.secret) {
      return res.status(400).json({ error: "JWT KEY not provided" });
    }

    const {
      id,
      name,
      cpf,
      rg,
      phone,
      date_birthday,
      street,
      street_number,
      zipcode,
      neighborhood,
      city,
      state,
      avatar,
    } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        cpf,
        rg,
        phone,
        date_birthday,
        address: {
          street,
          street_number,
          zipcode,
          neighborhood,
          city,
          state,
        },
        avatar,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expireIn,
      }),
    });
  }
}

export default new SessionController();
