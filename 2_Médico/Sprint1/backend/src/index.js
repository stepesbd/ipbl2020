const app = require("./app");

const port = 3001;

app.listen(port, () => {
  console.info(`Running server on port ${port}`);
});
