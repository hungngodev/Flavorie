import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { buildPostDocument } from "../services/postServices.ts"
import { ServerError } from "../errors/customErrors.ts";


export const createPost = async (req: Request, res: Response) => {
    try{
        const info = req.body;
        const newPost = buildPostDocument(info);
        if(newPost) {
            res.status(StatusCodes.OK).send(newPost);
        }
        else{
            res.status(StatusCodes.NOT_ACCEPTABLE);
        }
        
    } catch (err) {
        console.log("here")
        throw new ServerError(`${err}`)
    }
}

