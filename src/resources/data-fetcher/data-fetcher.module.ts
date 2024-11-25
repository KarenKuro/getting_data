import { Module } from '@nestjs/common';
import { DataFetchController } from './data-fetcher.controller';
import { DataFetchService } from './data-fetcher.service';

@Module({
  controllers: [DataFetchController],
  providers: [DataFetchService],
  exports: [],
})
export class DataFetchModule {}
