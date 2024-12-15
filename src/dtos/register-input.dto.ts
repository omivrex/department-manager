import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, MinLength } from "class-validator";

@InputType()
export class SignUpInput {
    @Field()
    @MinLength(2, { message: "Username must be at least 2 characters long" })
    username: string;

    @Field()
    @IsEmail({}, { message: "Invalid email address" })
    email: string;

    @Field()
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    password: string;
}
