import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateDepartmentInput, CreateSubDepartmentInput, UpdateDepartmentInput, UpdateSubDepartmentInput } from "../dtos/department-input.dto";
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

    async createSubDepartment(departmentId: number, input: CreateSubDepartmentInput): Promise<SubDepartmentEntity> {
        const { name } = input;
        const department = await this.deptRepository.findOne({ where: { id: departmentId } });
        if (!department) {
            throw new NotFoundException(`Department with ID ${departmentId} not found.`);
        }

        const existingSubDept = await this.subDeptRepository.findOne({
            where: { name: name.toLowerCase(), department: { id: departmentId } },
        });
        if (existingSubDept) {
            throw new ConflictException(`Sub-department with name "${name}" already exists.`);
        }

        const subDepartment = this.subDeptRepository.create({ name, department: { id: departmentId } });
        return await this.subDeptRepository.save(subDepartment);
    }

    async updateSubDepartment(subDepartmentId: number, input: UpdateSubDepartmentInput): Promise<SubDepartmentEntity> {
        const { name } = input;
        const subDepartment = await this.subDeptRepository.findOne({ where: { id: subDepartmentId } });
        if (!subDepartment) {
            throw new NotFoundException(`Sub-department with ID ${subDepartmentId} not found.`);
        }
        subDepartment.name = name.toLowerCase();
        return await this.subDeptRepository.save(subDepartment);
    }

    async deleteSubDepartment(subDepartmentId: number): Promise<boolean> {
        const subDepartment = await this.subDeptRepository.findOne({ where: { id: subDepartmentId } });
        if (!subDepartment) {
            throw new NotFoundException(`Sub-department with ID ${subDepartmentId} not found.`);
        }

        await this.subDeptRepository.delete(subDepartmentId);
        return true;
    }
}
