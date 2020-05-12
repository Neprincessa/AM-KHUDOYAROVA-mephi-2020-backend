const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

module.exports = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: false,
  synchronize: true,
  dropSchema: true,
  entities: ["src/**/*.entity.ts"],
  namingStrategy: new SnakeNamingStrategy(),
};
