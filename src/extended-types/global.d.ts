// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ProcessEnv {
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
}
