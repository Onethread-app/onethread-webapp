import { Router } from 'express'
import { middleware as query } from 'querymen'
import { create, index, show, update, destroy } from './controller'

const router = new Router()

/**
 * @api {post} //api/v1/user/registration Create user registration api
 * @apiName CreateUserRegistrationApi
 * @apiGroup UserRegistrationApi
 * @apiSuccess {Object} userRegistrationApi User registration api's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 User registration api not found.
 */
router.post('/',
  create)

/**
 * @api {get} //api/v1/user/registration Retrieve user registration apis
 * @apiName RetrieveUserRegistrationApis
 * @apiGroup UserRegistrationApi
 * @apiUse listParams
 * @apiSuccess {Object[]} userRegistrationApis List of user registration apis.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} //api/v1/user/registration/:id Retrieve user registration api
 * @apiName RetrieveUserRegistrationApi
 * @apiGroup UserRegistrationApi
 * @apiSuccess {Object} userRegistrationApi User registration api's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 User registration api not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} //api/v1/user/registration/:id Update user registration api
 * @apiName UpdateUserRegistrationApi
 * @apiGroup UserRegistrationApi
 * @apiSuccess {Object} userRegistrationApi User registration api's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 User registration api not found.
 */
router.put('/:id',
  update)

/**
 * @api {delete} //api/v1/user/registration/:id Delete user registration api
 * @apiName DeleteUserRegistrationApi
 * @apiGroup UserRegistrationApi
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 User registration api not found.
 */
router.delete('/:id',
  destroy)

export default router
