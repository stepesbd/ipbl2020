require('dotenv/config');

const app = require("./app");

app.listen(process.env.PORT, () => {
  console.info(`Running server on port ${process.env.PORT}`);
});
