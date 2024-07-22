import { plainToInstance, Expose, ClassConstructor } from "class-transformer";
import { validate, Matches, IsDefined, ValidationError } from "class-validator";
import { NextFunction } from "express";

interface IValidationError extends ValidationError {
	property: string;
	constraints: { [key: string]: string };
}

export default class RequestValidator {
	static async validateBody(
		req: any,
		res: any,
		next: NextFunction,
		classInstance: ClassConstructor<any>
	) {
		const instance = plainToInstance(classInstance, req.body);
		const errors = await validate(instance);

		if (errors.length > 0) {
			const formattedErrors: { [key: string]: Array<string> } = {};

			Object.entries(errors).forEach(([k, v]) => {
				const tmp = <IValidationError>v;
				formattedErrors[tmp.property] = Object.values(tmp.constraints);
			});

			res.status(400).json(formattedErrors);
		} else {
			req.body = instance;
			next();
		}
	}
}
