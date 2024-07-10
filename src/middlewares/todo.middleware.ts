import { NextFunction, Request, Response } from "express";

export class TodoMiddleware {
	static async isValidUserId(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			// Check if the id from /:id is valid where applicable
			const id = req.params?.id;
			if (id != null && !Number.isInteger(Number(id))) {
				throw new Error("Invalid ID");
			}

			next();
		} catch (error) {
			return res.status(403).json({ error: "Invalid ID" });
		}
	}
}
