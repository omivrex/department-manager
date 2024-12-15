import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { SubDepartmentEntity } from "src/entities/department.entity";
import { DepartmentService } from "./departments.service";
import { JwtAuthGuard } from "src/guards/auth.guard";
import { UseGuards } from "@nestjs/common";
import { CreateSubDepartmentInput, UpdateSubDepartmentInput } from "src/dtos/department-input.dto";

@Resolver(() => SubDepartmentEntity)
export class SubDepartmentResolver {
    constructor(private readonly departmentService: DepartmentService) {}

    @Mutation(() => SubDepartmentEntity)
    @UseGuards(JwtAuthGuard)
    async createSubDepartment(@Args("departmentId") departmentId: number, @Args("input") input: CreateSubDepartmentInput): Promise<SubDepartmentEntity> {
        return this.departmentService.createSubDepartment(departmentId, input);
    }

    @Mutation(() => SubDepartmentEntity)
    @UseGuards(JwtAuthGuard)
    async updateSubDepartment(@Args("id") id: number, @Args("input") input: UpdateSubDepartmentInput): Promise<SubDepartmentEntity> {
        return this.departmentService.updateSubDepartment(id, input);
    }
}
