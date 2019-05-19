import { Router } from 'express'
import { middleware as query } from 'querymen'
import { create, index, show, update, destroy } from './controller'

const router = new Router()

/**
 * @api {post} /api/v1/user/registration Create social login api
 * @apiName CreateSocialLoginApi
 * @apiGroup SocialLoginApi
 * @apiSuccess {Object} socialLoginApi Social login api's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Social login api not found.
 */
router.post('/',
  create)

/**
 * @api {get} /api/v1/user/registration Retrieve social login apis
 * @apiName RetrieveSocialLoginApis
 * @apiGroup SocialLoginApi
 * @apiUse listParams
 * @apiSuccess {Object[]} socialLoginApis List of social login apis.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /api/v1/user/registration/:id Retrieve social login api
 * @apiName RetrieveSocialLoginApi
 * @apiGroup SocialLoginApi
 * @apiSuccess {Object} socialLoginApi Social login api's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Social login api not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /api/v1/user/registration/:id Update social login api
 * @apiName UpdateSocialLoginApi
 * @apiGroup SocialLoginApi
 * @apiSuccess {Object} socialLoginApi Social login api's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Social login api not found.
 */
router.put('/:id',
  update)

/**
 * @api {delete} /api/v1/user/registration/:id Delete social login api
 * @apiName DeleteSocialLoginApi
 * @apiGroup SocialLoginApi
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Social login api not found.
 */
router.delete('/:id',
  destroy)

export default router
