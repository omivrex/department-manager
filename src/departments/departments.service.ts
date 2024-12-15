import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateDepartmentInput } from "../dtos/create-department-input.dto";
import { DepartmentEntity, SubDepartmentEntity } from "../entities/department.entity";
import { Repository } from "typeorm";

@Injectable()
export class DepartmentService {
    constructor(
        @InjectRepository(SubDepartmentEntity)
        private subDeptRepository: Repository<SubDepartmentEntity>,
        @InjectRepository(DepartmentEntity)
        private deptRepository: Repository<DepartmentEntity>,
    ) {}

    async createDepartment(input: CreateDepartmentInput): Promise<DepartmentEntity> {
        const { name, subDepartments } = input;

        const department = this.deptRepository.create({ name });

        if (subDepartments) {
            department.subDepartments = subDepartments.map((subDept) => this.subDeptRepository.create({ name: subDept.name }));
        }

        return await this.deptRepository.save(department);
    }
}
