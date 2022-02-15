import { Request } from "express";
import { Database, User } from "../types";

export const authorize = async (db: Database, req: Request): Promise<User | null> => {
  // Since token is to be in the header passed in the request
  const token = req.get("X-CSRF-TOKEN");

  const viewer = await db.users.findOne({
    _id: req.signedCookies.viewer,
    token,
  });

  return viewer;
};
