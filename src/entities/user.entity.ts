import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { ObjectType, Field } from "@nestjs/graphql";
import { IsEmail, MinLength } from "class-validator";

@Entity("users")
@ObjectType()
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    @Field()
    id: string;

    @Column({ unique: true })
    @Field()
    @MinLength(2, { message: "Username must be at least 2 characters long" })
    username: string;

    @Column({ unique: true })
    @Field()
    @IsEmail({}, { message: "Invalid email address" })
    email: string;

    @Column("text")
    password: string;

    @BeforeInsert()
    validateUsername() {
        if (!this.username || this.username.trim().length < 2) {
            throw new Error("Username must be at least 2 characters and cannot be blank");
        }
    }
}
