const app = require('../server')
const { getCalculatedPrice, getPrecentageSaved } = require('../utils')
const User = require('../models/user')
const request = require('supertest')

const email = 'test@gmail.com'
const password = 'myPassword'

beforeAll((done) => {
  User.remove({ email: email }, () => done())
})

afterAll((done) => {
  User.remove({ email: email }, () => done())
})

describe('Register and login', () => {
  let accessToken = ''
  let owner = '';
  let cardType = '';
  test('register', async () => {
    const response = await request(app).post('/api/v1/users').send({
      email: email,
      password: password,
      firstName: 'stam',
      lastName: 'stam',
      address: 'stamaddress',
      latAndLong: '123, 456',
      phone: '123456',
    })
    expect(response.statusCode).toEqual(200)
  }),
    test('login', async () => {
      const response = await request(app).post('/api/v1/users/login').send({
        email: email,
        password: password,
      })
      accessToken = response.body.accessToken
      owner = response.body.id;
      expect(accessToken).not.toEqual(null)

    }),
    test('get all users', async ()=>{
        const response = await request(app)
        .get('/api/v1/users')
        .set({ authorization: 'JWT ' + accessToken })
      expect(response.statusCode).toEqual(200)
    }),
    test('get user by id', async()=>{
        const response = await request(app)
        .get(`/api/v1/users/${owner}`)
        .set({ authorization: 'JWT ' + accessToken })
      expect(response.statusCode).toEqual(200)
    })
    test('getting cards with access token', async () => {
      const response = await request(app)
        .get('/api/v1/cards')
        .set({ authorization: 'JWT ' + accessToken })
      expect(response.statusCode).toEqual(200)
    }),
    test('get all card types', async () => {
      const response = await request(app)
        .get('/api/v1/cardTypes')
        .set({ authorization: 'JWT ' + accessToken })
        cardType = response.body[0].id;
    expect(response.statusCode).toEqual(200);
    })
     test('add a card', async () => {
      const response = await request(app)
        .post('/api/v1/cards')
        .set({ authorization: 'JWT ' + accessToken })
        .send({
          price: 200,
          value: 250,
          cardNumber: 123,
          cardType: cardType,
          owner: owner,
          isForSale: true,
          expirationDate: Date.now(),
        });
       cardType = response.body.id;
    expect(response.statusCode).toEqual(200);
    })
   
})

test('Getting Calculated Price', () => {
  expect(getCalculatedPrice(100)).toBe(100)
})

test('Get precentage', () => {
  expect(getPrecentageSaved(120, 200)).toBe('40.00%')
})
