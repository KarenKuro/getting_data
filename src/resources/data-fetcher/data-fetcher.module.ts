import { Module } from '@nestjs/common';
import { DataFetchController } from './data-fetcher.controller';
import { DataFetchService } from './data-fetcher.service';
import { HttpModule, HttpModuleOptions, HttpService } from '@nestjs/axios';
import axios, { AxiosInstance } from 'axios';
import { GoogleSheetsService } from './google.sheets.service';

@Module({
  imports: [HttpModule],
  controllers: [DataFetchController],
  providers: [DataFetchService, GoogleSheetsService],
  exports: [],
})
export class DataFetchModule {}
