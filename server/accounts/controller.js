import { success, notFound } from '../../services/response/'
import { Accounts } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Accounts.create(body)
    .then((accounts) => accounts.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Accounts.count(query)
    .then(count => Accounts.find(query, select, cursor)
      .then((accounts) => ({
        count,
        rows: accounts.map((accounts) => accounts.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Accounts.findById(params.id)
    .then(notFound(res))
    .then((accounts) => accounts ? accounts.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Accounts.findById(params.id)
    .then(notFound(res))
    .then((accounts) => accounts ? Object.assign(accounts, body).save() : null)
    .then((accounts) => accounts ? accounts.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Accounts.findById(params.id)
    .then(notFound(res))
    .then((accounts) => accounts ? accounts.remove() : null)
    .then(success(res, 204))
    .catch(next)
