import 'reflect-metadata';
import { env } from "./common/utils/envConfig";
import { app, logger, sequelize } from "./server";

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


