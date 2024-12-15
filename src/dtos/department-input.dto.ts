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

    @Field(() => [CreateSubDepartmentInput], { nullable: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSubDepartmentInput)
    @IsOptional()
    subDepartments?: CreateSubDepartmentInput[] | null;
}

@InputType()
export class UpdateDepartmentInput {
    @Field()
    @MinLength(2, { message: "Department name must be at least 2 characters long" })
    name: string;
}

@InputType()
export class UpdateSubDepartmentInput {
    @Field()
    @MinLength(2, { message: "Department name must be at least 2 characters long" })
    name: string;
}
