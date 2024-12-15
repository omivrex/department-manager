import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { ObjectType, Field } from "@nestjs/graphql";

@Entity("departments")
@ObjectType()
export class DepartmentEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column()
    @Field()
    name: string;

    @OneToMany(() => SubDepartmentEntity, (subDepartment) => subDepartment.department, { cascade: true })
    @Field(() => [SubDepartmentEntity], { nullable: true })
    subDepartments?: SubDepartmentEntity[];
}

@Entity("sub_departments")
@ObjectType()
export class SubDepartmentEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id: string;

    @Column()
    @Field()
    name: string;

    @ManyToOne(() => DepartmentEntity, (department) => department.subDepartments)
    @Field(() => DepartmentEntity)
    department: DepartmentEntity;
}
