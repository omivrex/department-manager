import { Module } from "@nestjs/common";
import { DepartmentResolver } from "./departments.resolver";
import { DepartmentService } from "./departments.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepartmentEntity, SubDepartmentEntity } from "src/entities/department.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([DepartmentEntity, SubDepartmentEntity]), AuthModule],
    providers: [DepartmentResolver, DepartmentService],
})
export class DepartmentsModule {}
