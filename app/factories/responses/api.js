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
		success: true,
		...options,
		status: 200,
	})
}
function _createErrorResponse(options) {
	return _generateResponse({
		success: false,
		...options,
		status: options.status ?? 500,
	})
}

module.exports = {
	createOKResponse: _createOKResponse,
	createErrorResponse: _createErrorResponse
}
