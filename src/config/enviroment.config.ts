/* eslint-disable prettier/prettier */
export default () => ({
  port: parseInt(process.env.SERVER_PORT, 10) || 8000,
  jwtSecret: process.env.JWT_SECRET || 'Mkslsj2661JBsnnjs284-+6*',
  jwtExpiresIn: process.env.JWT_EXPIRE_IN || '2h',
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  }
});

