import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class Todo {
	@PrimaryGeneratedColumn()
	@Index()
	id: number;

	@Column("text")
	name: string;

	@Column("date", { nullable: true })
	startDate?: Date;

	@Column("date", { nullable: true })
	endDate?: Date;
}
