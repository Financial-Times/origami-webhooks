const responseObject = (body, statusCode) => {
	return {
		statusCode,
		headers: { 'Content-Type': 'text/plain' },
		body: JSON.stringify(body)
	}
}

module.exports = {
	responseObject
}
