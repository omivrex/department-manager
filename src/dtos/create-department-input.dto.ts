import { InputType, Field } from "@nestjs/graphql";
import { MinLength, ValidateNested } from "class-validator";
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
    @ValidateNested({ each: true })
    @Type(() => CreateSubDepartmentInput)
    subDepartments?: CreateSubDepartmentInput[];
}
