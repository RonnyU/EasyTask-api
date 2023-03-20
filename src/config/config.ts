import path from 'path'
import dotenv from 'dotenv'

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../../config.env') })

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  NODE_ENV: string | undefined
  PORT: number | undefined
  MONGO_URI: string | undefined
  JWT_SECRET: string | undefined
  FRONTED_URL: string | undefined
  EMAIL_USER: string | undefined
  EMAIL_PASS: string | undefined
  EMAIL_HOST: string | undefined
  EMAIL_PORT: number | undefined
}

interface Config {
  NODE_ENV: string
  PORT: number
  MONGO_URI: string
  JWT_SECRET: string
  FRONTED_URL: string
  EMAIL_USER: string
  EMAIL_PASS: string
  EMAIL_HOST: string
  EMAIL_PORT: number
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT !== undefined ? Number(process.env.PORT) : undefined,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    FRONTED_URL: process.env.FRONTED_URL,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT !== undefined ? Number(process.env.EMAIL_PORT) : undefined
  }
}

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`)
    }
  }
  return config as Config
}

const config = getConfig()

const sanitizedConfig = getSanitzedConfig(config)

export default sanitizedConfig
