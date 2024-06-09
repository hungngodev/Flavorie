
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ServerError } from "../errors/customErrors.ts";
import { buildPostDocument } from "../services/postServices.ts";


export const createPost = async (req: Request, res: Response) => {
  try {
    const info = req.body;
    const newPost = await buildPostDocument(info);
    if (!newPost) {
      res.status(StatusCodes.NOT_ACCEPTABLE);
    }
    res.status(StatusCodes.OK).json({ id: newPost });
  } catch (err) {
    console.log("here");
    throw new ServerError(`${err}`);
  }
};






