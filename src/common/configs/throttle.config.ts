import { registerAs } from '@nestjs/config'
import Joi from 'joi'

export const throttleConfig = () =>
  registerAs('throttle', () => {
    const values = {
      ttl: parseInt(process.env.THROTTLER_TTL),
      limit: parseInt(process.env.THROTTLER_LIMIT)
    }
    const schema = Joi.object({
      ttl: Joi.number().required(),
      limit: Joi.number().required()
    })
    const { error } = schema.validate(values, { abortEarly: false })
    if (error) {
      throw new Error(error.message)
    }
    return values
  })
