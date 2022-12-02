
/**
* @api {get} /schema GET /schema
* @apiVersion 1.0.0
* @apiName GET-/schema
* @apiGroup Default
* @apiPermission Unknown
*
* @apidescription
*   No Description
*

*
* @apiSchema (Query) {jsonschema=../schema/req.query.ListSchema.json} apiParam
*
* @apiSchema {jsonschema=../schema/res.ListSchema.json} apiSuccess
*/


/**
* @api {get} /query/:source/:layer Query
* @apiVersion 1.0.0
* @apiName GET-/query/:source/:layer
* @apiGroup Query
* @apiPermission public
*
* @apidescription
*   Retrieve a feature closest to a given lat/lng
*
* @apiParam {string} source param
* @apiParam {string} layer param
*
* @apiSchema (Query) {jsonschema=../schema/req.query.Query.json} apiParam
*
* @apiSchema {jsonschema=../schema/res.Query.json} apiSuccess
*/
