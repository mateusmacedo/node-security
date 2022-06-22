import { registerAs } from '@nestjs/config'
import Joi from 'joi'

export const appConfig = () =>
  registerAs('app', () => {
    const configModule = {
      ignoreEnvFile: process.env.IGNORE_ENV_FILE === 'true',
      envFilePath: process.env.ENV_FILE_PATH,
      expandVariables: process.env.EXPAND_VARIABLES === 'true',
      cache: process.env.CACHE === 'true',
      isGlobal: true
    }
    const values = {
      configModule,
      name: process.env.APP_NAME,
      description: process.env.APP_DESCRIPTION,
      version: process.env.APP_VERSION,
      port: parseInt(process.env.APP_PORT)
    }
    const schema = Joi.object({
      configModule: Joi.object({
        ignoreEnvFile: Joi.boolean().default(false),
        envFilePath: Joi.string().default('.env'),
        expandVariables: Joi.boolean().default(true),
        cache: Joi.boolean().default(false),
        isGlobal: Joi.boolean().default(true)
      }).required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      version: Joi.string().required(),
      port: Joi.number().required()
    })
    const { error } = schema.validate(values, { abortEarly: false })
    if (error) {
      throw new Error(error.message)
    }
    return values
  })
