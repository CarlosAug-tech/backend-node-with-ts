import { Request, Response } from "express";
import prisma from "../../lib/prisma";

interface IMulterRequest extends Request {
  file: any;
}

class FileController {
  async store(req: Request, res: Response): Promise<any> {
    const { originalname: name, filename: path } = (req as IMulterRequest).file;

    const url = `http://localhost:3333/files/${path}`;

    const file = await prisma.file.create({
      data: {
        name,
        path,
        url,
      },
    });

    return res.json(file);
  }
}

export default new FileController();
