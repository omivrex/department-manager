import { ConflictException, Injectable } from "@nestjs/common";
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

        const existingDepartment = await this.deptRepository.findOne({ where: { name } });
        if (existingDepartment) {
            throw new ConflictException(`A department with the name "${name}" already exists.`);
        }

        const department = this.deptRepository.create({ name: name.toLowerCase() });

        if (subDepartments && subDepartments.length > 0) {
            department.subDepartments = subDepartments.map((subDept) => this.subDeptRepository.create({ name: subDept.name.toLowerCase() }));
        } else {
            department.subDepartments = []; // Ensure subDepartments is initialized as an empty array
        }

        return await this.deptRepository.save(department);
    }
}
