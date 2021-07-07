function _generateResponse(options = {res: null, status: 200, data: {}, errors: {}, msg: "", success: true}) {
	return options.res.status(options.status).json({
		"success": options?.success ?? true,
		"data": options?.data ?? {},
		"errors": options?.errors ?? {},
		"msg": options?.msg ?? ""
	});
}
function _createOKResponse(options) {
	return _generateResponse({
		...options,
		status: 200,
		success: true
	})
}
function _createErrorResponse(options) {
	return _generateResponse({
		...options,
		status: options.status ?? 500,
		success: false
	})
}

module.exports = {
	createOKResponse: _createOKResponse,
	createErrorResponse: _createErrorResponse
}
