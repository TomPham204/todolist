import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	@Index()
	id: number;

	@Column("text")
	name: string;

	@Column("text", { unique: true })
	email: string;

	@Column("text")
	availableStart: string; // this user is available starting from time availableStart. should be time and minute in 24hrs format. e.g. 13:25

	@Column("text")
	availableEnd?: string; // this user is available until time availableEnd. should be time and minute in 24hrs format. e.g. 13:45
}
