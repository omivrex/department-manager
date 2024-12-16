import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql";
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
    async createDepartment(@Context() context, @Args("input") input: CreateDepartmentInput): Promise<DepartmentEntity> {
        const adminId = context.req.user.sub;
        return this.departmentService.createDepartment(input, adminId);
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

    @Query(() => [DepartmentEntity])
    @UseGuards(JwtAuthGuard)
    async getDepartments(
        @Args("id", { type: () => Number, nullable: true }) id?: number,
        @Args("page", { type: () => Number, nullable: true }) page = 1,
        @Args("limit", { type: () => Number, nullable: true }) limit = 10,
    ): Promise<DepartmentEntity[]> {
        return this.departmentService.getDepartments(page, limit, id);
    }
}
