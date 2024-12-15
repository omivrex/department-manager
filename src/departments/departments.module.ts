import { Module } from '@nestjs/common';
import { DepartmentsResolver } from './departments.resolver';
import { DepartmentsService } from './departments.service';

@Module({
  providers: [DepartmentsResolver, DepartmentsService]
})
export class DepartmentsModule {}
