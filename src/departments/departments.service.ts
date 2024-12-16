import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateDepartmentInput, CreateSubDepartmentInput, UpdateDepartmentInput, UpdateSubDepartmentInput } from "../dtos/department-input.dto";
import { DepartmentEntity, SubDepartmentEntity } from "../entities/department.entity";
import { In, Repository } from "typeorm";
import { UserEntity } from "src/entities/user.entity";

@Injectable()
export class DepartmentService {
    constructor(
        @InjectRepository(SubDepartmentEntity)
        private subDeptRepository: Repository<SubDepartmentEntity>,
        @InjectRepository(DepartmentEntity)
        private deptRepository: Repository<DepartmentEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    async createDepartment(input: CreateDepartmentInput, adminId: string): Promise<DepartmentEntity> {
        const { name, subDepartments } = input;

        const existingDepartment = await this.deptRepository.findOne({
            where: { name: name.toLowerCase() },
        });

        if (existingDepartment) {
            throw new Error("A department with this name already exists.");
        }

        // Create the department
        const department = this.deptRepository.create({ name: name.toLowerCase(), admin: { id: adminId } });

        // ensure no two sub departments has thesame name under 1 dept
        if (subDepartments) {
            const uniqueSubDeptNames = new Set();
            subDepartments.forEach((subDept) => {
                const lowerCasedName = subDept.name.toLowerCase();
                if (uniqueSubDeptNames.has(lowerCasedName)) {
                    throw new Error(`Sub-department names must be unique within the same department. Duplicate found: ${subDept.name}`);
                }
                uniqueSubDeptNames.add(lowerCasedName);
            });

            department.subDepartments = subDepartments.map((subDept) => this.subDeptRepository.create({ name: subDept.name.toLowerCase() }));
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

    async getDepartments(page: number, limit: number, id?: number): Promise<DepartmentEntity[]> {
        if (id) {
            const department = await this.deptRepository.findOne({
                where: { id },
                relations: ["subDepartments"],
            });

            if (!department) {
                throw new NotFoundException(`Department with ID ${id} not found.`);
            }
            return [department]; // Wrap in an array to match the return type
        }

        page = page >= 1 ? page : 1;
        const skip = (page - 1) * limit;

        return this.deptRepository.find({
            relations: ["subDepartments"],
            skip,
            take: limit,
            order: { id: "ASC" },
        });
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

        // check if a sub-department already has that name
        const existingSubDepartment = await this.subDeptRepository.count({
            where: { name: name.toLowerCase(), departmentId: subDepartment.departmentId },
        });
        if (existingSubDepartment > 0) {
            throw new Error(`Sub-department with name "${name}" already exists in this department.`);
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

    async getSubDepartments(departmentId: number, id?: number, page?: number, limit?: number): Promise<SubDepartmentEntity[]> {
        if (id) {
            const subDepartment = await this.subDeptRepository.findOne({ where: { id } });

            if (!subDepartment) {
                throw new NotFoundException(`Sub-department with ID ${id} not found.`);
            }
            return [subDepartment]; // Wrap in an array to match the return type
        }

        page = page >= 1 ? page : 1;
        const queryBuilder = this.subDeptRepository.createQueryBuilder("subDepartment");

        if (departmentId) {
            queryBuilder.where("subDepartment.departmentId = :departmentId", { departmentId });
        }

        queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("subDepartment.id", "ASC");

        const subDepartments = await queryBuilder.getMany();

        if (!subDepartments.length && departmentId) {
            throw new NotFoundException(`No sub-departments found for department ID ${departmentId}.`);
        }

        return subDepartments;
    }

    async addMembersToSubDepartment(adminId: string, subDepartmentId: number, memberEmails: string[]): Promise<SubDepartmentEntity> {
        const subDepartment = await this.subDeptRepository.findOne({
            where: { id: subDepartmentId },
            relations: ["department", "members"],
        });

        if (!subDepartment) {
            throw new NotFoundException(`Sub-department with ID ${subDepartmentId} not found.`);
        }

        // Check if the admin has permission
        if (subDepartment.department.admin.id !== adminId) {
            throw new Error("Only the admin of the department can add members to its sub-departments.");
        }

        // Fetch users by emails
        const users = await this.userRepository.find({
            where: { email: In(memberEmails) },
        });

        if (users.length !== memberEmails.length) {
            throw new NotFoundException("Some users were not found.");
        }

        // Add new members
        subDepartment.members = Array.from(new Set([...subDepartment.members, ...users]));

        return await this.subDeptRepository.save(subDepartment);
    }
}
