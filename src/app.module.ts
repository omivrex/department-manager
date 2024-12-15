import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { AppConfigModule } from "./config/config.module";
import { DepartmentsModule } from "./departments/departments.module";

@Module({
    imports: [AuthModule, DepartmentsModule, AppConfigModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
