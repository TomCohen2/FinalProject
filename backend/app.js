const app = require('./server');

const api = process.env.API_URL;

app.listen(8000, () => {
  console.log(api);
  console.log("Server started on port 8000");
});
