import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { SubDepartmentEntity } from "src/entities/department.entity";
import { DepartmentService } from "./departments.service";
import { JwtAuthGuard } from "src/guards/auth.guard";
import { UseGuards } from "@nestjs/common";
import { CreateSubDepartmentInput } from "src/dtos/department-input.dto";

@Resolver(() => SubDepartmentEntity)
export class SubDepartmentResolver {
    constructor(private readonly departmentService: DepartmentService) {}

    @Mutation(() => SubDepartmentEntity)
    @UseGuards(JwtAuthGuard)
    async createSubDepartment(@Args("departmentId") departmentId: number, @Args("input") input: CreateSubDepartmentInput): Promise<SubDepartmentEntity> {
        return this.departmentService.createSubDepartment(departmentId, input);
    }
}
