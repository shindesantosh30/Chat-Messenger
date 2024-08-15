// apiResponse.js

class ApiResponse {
    constructor(message = "Okay", code = 200, success = true, data = {}, paginator = {}) {
        if (data === null) {
            data = {};
        }
        this.message = message;
        this.code = code;
        this.success = success;
        this.data = data;
        this.paginator = paginator;
    }

    messageFormat(message) {
        if (typeof message === 'string') {
            return [message];
        } else {
            return message;
        }
    }

    responseCreated(message = "Resource created", code = 201, success = true, data = {}) {
        message = this.messageFormat(message);
        const response = { message, code, success, data };
        return response;
    }

    responseOk(message = "Ok", code = 200, success = true, data = {}, paginator = {}) {
        message = this.messageFormat(message);
        const response = { message, code, success, data };
        if (paginator) {
            response.paginator = paginator;
        }
        return response;
    }

    responseInternalServerError(message = "Internal server error", code = 500, success = false, data = {}) {
        message = this.messageFormat(message);
        const response = { message, code, success, data };
        return response;
    }

    responseBadRequest(message = "Bad Request", code = 400, success = false, data = {}) {
        message = this.messageFormat(message);
        const response = { message, code, success, data };
        return response;
    }

    responseUnauthenticate(message = "Unauthenticate", code = 401, success = false, data = {}) {
        message = this.messageFormat(message);
        const response = { message, code, success, data };
        return response;
    }

    responseUnauthorized(message = "Unauthorized", code = 403, success = false, data = {}) {
        message = this.messageFormat(message);
        const response = { message, code, success, data };
        return response;
    }

    responseNotFound(message = "Not Found", code = 404, success = false, data = {}) {
        message = this.messageFormat(message);
        const response = { message, code, success, data };
        return response;
    }

    responseNotAcceptable(message = "Not acceptable", code = 406, success = false, data = {}) {
        message = this.messageFormat(message);
        const response = { message, code, success, data };
        return response;
    }
}

module.exports = new ApiResponse();
