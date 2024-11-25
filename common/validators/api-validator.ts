import Joi from 'joi';

export const API_VALIDATIONS = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  ENVIRONMENT: Joi.string()
    .valid('development', 'staging', 'production')
    .default('development'),
  APP_VERSION: Joi.string().required(),
  APP_NAME: Joi.string().required(),
});
