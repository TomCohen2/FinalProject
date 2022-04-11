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
        url: /\/api\/v1\/cards(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/users(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/test(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/categories(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/coinTransactions(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/cardTypes(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/cards(.*)/,
        methods: ["PUT", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/users(.*)/,
        methods: ["PUT", "OPTIONS"],
      },
      {
        url: `${api}/users/login`,
        methods: ["POST", "OPTIONS"],
      },
      {
        url: `${api}/cards`,
        methods: ["POST", "OPTIONS"],
      },
      {
        url: `${api}/users/register`,
        methods: ["POST", "OPTIONS"],
      },
      {
        url: `${api}/coinTransactions`,
        methods: ["POST", "OPTIONS"],
      },
      {
        url: `${api}/cardTypes`,
        methods: ["POST", "OPTIONS"],
      },
      {
        url: `${api}/users`,
        methods: ["POST", "OPTIONS"],
      },
      {
        url: `${api}/categories`,
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
