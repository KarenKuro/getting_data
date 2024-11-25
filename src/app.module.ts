import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NodeEnv } from '@common/enums';
import { API_VALIDATIONS } from '@common/validators';
import { DataFetchModule } from './resources';
import { ENV_CONST } from '@common/constants';
import { appConfig } from '@common/config';

const isProductionMode = process.env.NODE_ENV === NodeEnv.production;
const envFilePath = isProductionMode
  ? ENV_CONST.ENV_PATH_PROD
  : ENV_CONST.ENV_PATH_DEV;

@Module({
  imports: [
    DataFetchModule,
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      expandVariables: true,
      validationSchema: API_VALIDATIONS,
      load: [appConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
