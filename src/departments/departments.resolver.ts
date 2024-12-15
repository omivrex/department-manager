import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { DepartmentService } from "./departments.service";
import { CreateDepartmentInput, UpdateDepartmentInput } from "../dtos/department-input.dto";
import { DepartmentEntity } from "../entities/department.entity";
import { JwtAuthGuard } from "src/guards/auth.guard";
import { UseGuards } from "@nestjs/common";

@Resolver(() => DepartmentEntity)
export class DepartmentResolver {
    constructor(private readonly departmentService: DepartmentService) {}

    @Mutation(() => DepartmentEntity)
    @UseGuards(JwtAuthGuard)
    async createDepartment(@Args("input") input: CreateDepartmentInput): Promise<DepartmentEntity> {
        return this.departmentService.createDepartment(input);
    }
    @Mutation(() => DepartmentEntity)
    @UseGuards(JwtAuthGuard)
    async updateDepartment(@Args("input") input: UpdateDepartmentInput, @Args("id") id: number): Promise<DepartmentEntity> {
        return this.departmentService.updateDepartment(id, input);
    }
    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async deleteDepartment(@Args("id") id: number): Promise<boolean> {
        return this.departmentService.deleteDepartment(id);
    }

    @Query(() => DepartmentEntity)
    @UseGuards(JwtAuthGuard)
    async getDepartment() {
        return [];
    }
}
