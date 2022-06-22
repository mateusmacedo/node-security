import { registerAs } from '@nestjs/config'
import Joi from 'joi'

export const loggerConfig = () =>
  registerAs('logger', () => {
    const values = {
      enabled: JSON.parse(process.env.LOGGER_PINO_HTTP_ENABLED),
      level: process.env.LOGGER_PINO_HTTP_LEVEL,
      autoLogging: JSON.parse(process.env.LOGGER_PINO_HTTP_AUTO_LOGGING),
      quietReqLogger: JSON.parse(process.env.LOGGER_PINO_HTTP_QUIET_REQ_LOGGER),
      minLength: parseInt(process.env.LOGGER_PINO_HTTP_MIN_LENGTH)
    }
    const schema = Joi.object({
      enabled: Joi.boolean().required(),
      level: Joi.string().required(),
      autoLogging: Joi.boolean().required(),
      quietReqLogger: Joi.boolean().required(),
      minLength: Joi.number().required()
    })
    const { error } = schema.validate(values, { abortEarly: false })
    if (error) {
      throw new Error(error.message)
    }
    return values
  })
