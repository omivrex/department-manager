import { InputType, Field } from "@nestjs/graphql";
import { IsArray, IsOptional, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@InputType()
export class CreateSubDepartmentInput {
    @Field()
    @MinLength(2, { message: "Sub-department name must be at least 2 characters long" })
    name: string;
}

@InputType()
export class CreateDepartmentInput {
    @Field()
    @MinLength(2, { message: "Department name must be at least 2 characters long" })
    name: string;

    @Field(() => [CreateSubDepartmentInput], { nullable: true }) // Allow null for subDepartments
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSubDepartmentInput) // Required for ValidateNested to work with nested objects
    @IsOptional() // Allows the field to be omitted or set as null
    subDepartments?: CreateSubDepartmentInput[] | null;
}
