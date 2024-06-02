/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

const envSchema = Joi.object({
  SERVER_PORT: Joi.number().default(8080),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().default('Annskjnxka5+18498-*+sbasbAbbds='),
  JWT_EXPIRE_IN: Joi.string().default('2h'),
});

export default envSchema;
