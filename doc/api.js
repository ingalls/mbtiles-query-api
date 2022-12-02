
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
* @api {get} /query Sources
* @apiVersion 1.0.0
* @apiName GET-/query
* @apiGroup Query
* @apiPermission public
*
* @apidescription
*   Return available data sources
*

*
*
*
* @apiSchema {jsonschema=../schema/res.Object.json} apiSuccess
*/


/**
* @api {get} /query/:source Query
* @apiVersion 1.0.0
* @apiName GET-/query/:source
* @apiGroup Query
* @apiPermission public
*
* @apidescription
*   Retrieve a feature closest to a given lat/lng
*
* @apiParam {string} source param
*
*
*
* @apiSchema {jsonschema=../schema/res.Object.json} apiSuccess
*/


/**
* @api {get} /query/:source/:zoom/query Query
* @apiVersion 1.0.0
* @apiName GET-/query/:source/:zoom/query
* @apiGroup Query
* @apiPermission public
*
* @apidescription
*   Retrieve a feature closest to a given lat/lng
*
* @apiParam {string} source param
* @apiParam {integer} zoom param
*
* @apiSchema (Query) {jsonschema=../schema/req.query.Query.json} apiParam
*
* @apiSchema {jsonschema=../schema/res.Query.json} apiSuccess
*/
