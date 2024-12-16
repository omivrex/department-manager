import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { ObjectType, Field } from "@nestjs/graphql";
import { MinLength } from "class-validator";
import { UserEntity } from "./user.entity";

@Entity("departments")
@ObjectType()
export class DepartmentEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ unique: true })
    @MinLength(2, { message: "Department name must be at least 2 characters long" })
    @Field()
    name: string;

    @OneToMany(() => SubDepartmentEntity, (subDepartment) => subDepartment.department, { cascade: true })
    @Field(() => [SubDepartmentEntity], { nullable: true })
    subDepartments?: SubDepartmentEntity[];

    @ManyToOne(() => UserEntity, { eager: true })
    @JoinColumn({ name: "adminId" })
    admin: UserEntity;
}

@Entity("sub_departments")
@ObjectType()
export class SubDepartmentEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column({ unique: true })
    @MinLength(2, { message: "Sub-department name must be at least 2 characters long" })
    @Field()
    name: string;

    @ManyToOne(() => DepartmentEntity, (department) => department.subDepartments)
    @Field(() => DepartmentEntity)
    department: DepartmentEntity;

    @Column()
    departmentId: number;

    @ManyToMany(() => UserEntity, { eager: true })
    @JoinTable({ name: "sub_department_members" })
    members: UserEntity[];
}
