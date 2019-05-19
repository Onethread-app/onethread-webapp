import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Accounts } from '.'

const app = () => express(apiRoot, routes)

let accounts

beforeEach(async () => {
  accounts = await Accounts.create({})
})

test('POST //api/v1/accounts 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ email: 'test', password: 'test', type: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.email).toEqual('test')
  expect(body.password).toEqual('test')
  expect(body.type).toEqual('test')
})

test('GET //api/v1/accounts 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET //api/v1/accounts/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${accounts.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(accounts.id)
})

test('GET //api/v1/accounts/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT //api/v1/accounts/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${accounts.id}`)
    .send({ email: 'test', password: 'test', type: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(accounts.id)
  expect(body.email).toEqual('test')
  expect(body.password).toEqual('test')
  expect(body.type).toEqual('test')
})

test('PUT //api/v1/accounts/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ email: 'test', password: 'test', type: 'test' })
  expect(status).toBe(404)
})

test('DELETE //api/v1/accounts/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${accounts.id}`)
  expect(status).toBe(204)
})

test('DELETE //api/v1/accounts/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
