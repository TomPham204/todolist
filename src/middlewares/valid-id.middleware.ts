import { NextFunction, Request, Response } from "express";

export class ValidIDMiddleware {
	static async isValidId(req: Request, res: Response, next: NextFunction) {
		try {
			// Check if the id from /:id is valid where applicable
			const id = req.params?.id;
			if (id != null && !Number.isInteger(Number(id))) {
				return res.status(400).json({ message: "Invalid ID" });
			}

			next();
		} catch (error) {
			return res.status(400).json({ message: "Invalid ID" });
		}
	}
}
