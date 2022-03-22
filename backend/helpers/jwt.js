const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.JWT_SECRET;
  const api = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      {
        url: /\/api\/v1\/products(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/categories(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: `${api}/users/login`,
        methods: ["POST", "OPTIONS"],
      },
      {
        url: `${api}/users/register`,
        methods: ["POST", "OPTIONS"],
      },
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    return done(null, true);
  }
  done();
}

module.exports = authJwt;
