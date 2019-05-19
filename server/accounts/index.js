import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './account.model'

const router = new Router()
const { email, password, type } = schema.tree

/**
 * @api {post} //api/v1/accounts Create accounts
 * @apiName CreateAccounts
 * @apiGroup Accounts
 * @apiParam email Accounts's email.
 * @apiParam password Accounts's password.
 * @apiParam type Accounts's type.
 * @apiSuccess {Object} accounts Accounts's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Accounts not found.
 */
router.post('/',
  body({ email, password, type }),
  create)

/**
 * @api {get} //api/v1/accounts Retrieve accounts
 * @apiName RetrieveAccounts
 * @apiGroup Accounts
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of accounts.
 * @apiSuccess {Object[]} rows List of accounts.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} //api/v1/accounts/:id Retrieve accounts
 * @apiName RetrieveAccounts
 * @apiGroup Accounts
 * @apiSuccess {Object} accounts Accounts's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Accounts not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} //api/v1/accounts/:id Update accounts
 * @apiName UpdateAccounts
 * @apiGroup Accounts
 * @apiParam email Accounts's email.
 * @apiParam password Accounts's password.
 * @apiParam type Accounts's type.
 * @apiSuccess {Object} accounts Accounts's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Accounts not found.
 */
router.put('/:id',
  body({ email, password, type }),
  update)

/**
 * @api {delete} //api/v1/accounts/:id Delete accounts
 * @apiName DeleteAccounts
 * @apiGroup Accounts
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Accounts not found.
 */
router.delete('/:id',
  destroy)

export default router
