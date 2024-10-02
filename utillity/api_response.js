// apiResponse.js

class ApiResponse {

    messageFormat(message) {
        return typeof message === 'string' ? [message] : message;
    }

    responseCreated(message = "Resource created", code = 201, success = true, data = {}) {
        return { message, code, success, data };
    }

    responseOk(message = "Ok", code = 200, success = true, data = {}, paginator = {}) {
        const response = { message, code, success, data };
        if (paginator) { response.paginator = paginator; }
        return response;
    }

    responseInternalServerError(message = "Internal server error", code = 500, success = false, data = {}) {
        return { message, code, success, data };
    }

    responseBadRequest(message = "Bad Request", code = 400, success = false, data = {}) {
        return { message, code, success, data };
    }

    responseUnauthenticate(message = "Unauthenticate", code = 401, success = false, data = {}) {
        return { message, code, success, data };
    }

    responseUnauthorized(message = "Unauthorized", code = 403, success = false, data = {}) {
        return { message, code, success, data };
    }

    responseNotFound(message = "Not Found", code = 404, success = false, data = {}) {
        return { message, code, success, data };
    }

    responseNotAcceptable(message = "Not acceptable", code = 406, success = false, data = {}) {
        return { message, code, success, data };
    }

    responseConflict(message = "Not acceptable", code = 409, success = false, data = {}) {
        return { message, code, success, data };
    }
}

module.exports = new ApiResponse();
