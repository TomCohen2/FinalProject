const app = require('./server');

const api = process.env.API_URL;

const port=process.env.PORT;

app.listen(port, () => {
  console.log(api);
  console.log(`Server started on port ${port}`);
});

