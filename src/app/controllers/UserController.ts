import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import prisma from "../../lib/prisma";

class UserController {
  async store(req: Request, res: Response) {
    const {
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
      email,
      password,
    } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const encryptPassword = await bcrypt.hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
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
        password: encryptPassword,
      },
    });

    const { id } = user;

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req: Request, res: Response) {
    const { name, avatar_id, email, oldPassword, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id:
          // @ts-ignore
          req.userId,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user) {
      if (email !== user.email) {
        const userExists = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (userExists) {
          return res.status(400).json({ error: "User already exists" });
        }
      }
    }

    if (oldPassword && !(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ error: "Password does not match" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        password,
        fileId: avatar_id,
        ...req.body,
      },
    });

    const userUpdated = await prisma.user.findUnique({
      where: {
        id:
          // @ts-ignore
          req.userId,
      },
      include: {
        avatar: {},
      },
    });

    return res.json({
      id: userUpdated?.id,
      name: userUpdated?.name,
      email: userUpdated?.email,
      cpf: userUpdated?.cpf,
      rg: userUpdated?.rg,
      phone: userUpdated?.phone,
      date_birthday: userUpdated?.date_birthday,
      address: {
        street: userUpdated?.street,
        street_number: userUpdated?.street_number,
        zipcode: userUpdated?.zipcode,
        neighborhood: userUpdated?.neighborhood,
        city: userUpdated?.city,
        state: userUpdated?.state,
      },
      avatar: userUpdated?.avatar,
    });
  }
}

export default new UserController();
