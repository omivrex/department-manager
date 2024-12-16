import { Module } from "@nestjs/common";
import { DepartmentResolver } from "./departments.resolver";
import { DepartmentService } from "./departments.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepartmentEntity, SubDepartmentEntity } from "src/entities/department.entity";
import { AuthModule } from "src/auth/auth.module";
import { SubDepartmentResolver } from "./sub-department.resolver";
import { UserEntity } from "src/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([DepartmentEntity, SubDepartmentEntity, UserEntity]), AuthModule],
    providers: [DepartmentResolver, SubDepartmentResolver, DepartmentService],
})
export class DepartmentsModule {}
