import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes from '.'

const app = () => express(apiRoot, routes)

test('POST //api/v1/user/registration 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
})

test('GET //api/v1/user/registration 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})
