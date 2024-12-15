import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
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

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async deleteSubDepartment(@Args("id") id: number): Promise<boolean> {
        return this.departmentService.deleteSubDepartment(id);
    }

    @Query(() => [SubDepartmentEntity])
    @UseGuards(JwtAuthGuard)
    async getSubDepartments(
        @Args("departmentId", { type: () => Number, nullable: true }) departmentId?: number,
        @Args("id", { type: () => Number, nullable: true }) id?: number,
        @Args("page", { type: () => Number, nullable: true }) page = 1,
        @Args("limit", { type: () => Number, nullable: true }) limit = 10,
    ): Promise<SubDepartmentEntity[]> {
        return this.departmentService.getSubDepartments(departmentId, id, page, limit);
    }
}
