import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateDepartmentInput, UpdateDepartmentInput } from "../dtos/department-input.dto";
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

    async updateDepartment(id: number, input: UpdateDepartmentInput): Promise<DepartmentEntity> {
        const { name } = input;

        const department = await this.deptRepository.findOne({ where: { id: id } });
        if (!department) {
            throw new NotFoundException(`Department with ID ${id} not found.`);
        }

        const deptWithSameName = await this.deptRepository.count({
            where: { name: name.toLowerCase() },
        });

        if (deptWithSameName > 1) {
            throw new ConflictException(`A department with the name "${name}" already exists.`);
        }

        department.name = name.toLowerCase();
        return await this.deptRepository.save(department);
    }

    async deleteDepartment(id: number): Promise<boolean> {
        const department = await this.deptRepository.findOne({ where: { id } });
        if (!department) {
            throw new NotFoundException(`Department with ID ${id} not found.`);
        }

        await this.subDeptRepository.delete({ department: { id } });

        await this.deptRepository.delete(id);

        return true;
    }
}
