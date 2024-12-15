import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { DepartmentService } from "./departments.service";
import { CreateDepartmentInput } from "../dtos/create-department-input.dto";
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

    @Query(() => DepartmentEntity)
    @UseGuards(JwtAuthGuard)
    async getDepartment() {
        return [];
    }
}
