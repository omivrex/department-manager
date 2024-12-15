import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { DepartmentEntity, SubDepartmentEntity } from "src/entities/department.entity";
import { DepartmentsModule } from "src/departments/departments.module";

@Module({
    imports: [
        DepartmentsModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            context: ({ req, res }) => ({ req, res }),
            playground: true,
            introspection: true,
        }),

        ConfigModule.forRoot({ isGlobal: true }),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get<string>("DB_HOST"),
                username: configService.get<string>("DB_USERNAME"),
                password: configService.get<string>("DB_PASSWORD"),
                database: configService.get<string>("DB_NAME"),
                entities: [UserEntity, DepartmentEntity, SubDepartmentEntity],
                synchronize: true,
            }),
        }),
    ],
})
export class AppConfigModule {}
