const extractErrorMessage = (error) => {
    if (!error) return `❌ Unknown error occurred`;
    if (typeof error === 'string') return error;
    return error.message || error.error?.message || error.errors?.[0]?.message ||
        error.sqlMessage || error.details?.[0]?.message || `❌ Unknown error occurred`;
};

const formatError = (error) => {
    if (!error) return null;
    return {
        message: extractErrorMessage(error),
        code: error.code || error.name || 'UNKNOWN_ERROR',
        ...(error.errors && { details: error.errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    };
};

const HTTP_STATUS = {
    OK: 200, CREATED: 201, NO_CONTENT: 204, BAD_REQUEST: 400,
    UNAUTHORIZED: 401, FORBIDDEN: 403, NOT_FOUND: 404,
    CONFLICT: 409, UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429, INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

const responseHandler = {
    success: (res, message, data = null) => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send success response.');
            return;
        }
        return res.status(200).json({
            success: true,
            message,
            data
        });
    },
    created: (res, message, data) => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send created response.');
            return;
        }
        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: `${message}`,
            data,
            statusCode: HTTP_STATUS.CREATED
        });
    },
    noContent: (res) => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send noContent response.');
            return;
        }
        return res.status(HTTP_STATUS.NO_CONTENT).send();
    },
    error: (res, message, statusCode = 400) => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send error response.');
            return;
        }
        return res.status(statusCode).json({
            success: false,
            message: message || 'Something went wrong'
        });
    },
    badRequest: (res, error) => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send badRequest response.');
            return;
        }
        const formattedError = formatError(error);
        formattedError.code = formattedError.code === 'UNKNOWN_ERROR' ? 'BAD_REQUEST' : formattedError.code;
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: `⚠️ ${formattedError.message}`,
            error: formattedError,
            statusCode: HTTP_STATUS.BAD_REQUEST
        });
    },
    unauthorized: (res, message = 'Unauthorized access') => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send unauthorized response.');
            return;
        }
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: `🔒 ${message}`,
            error: 'UNAUTHORIZED',
            statusCode: HTTP_STATUS.UNAUTHORIZED
        });
    },
    forbidden: (res, message = 'Access forbidden') => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send forbidden response.');
            return;
        }
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            message: `🚫 ${message}`,
            error: 'FORBIDDEN',
            statusCode: HTTP_STATUS.FORBIDDEN
        });
    },
    notFound: (res, message = 'Resource not found') => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send notFound response.');
            return;
        }
        return res.status(404).json({
            success: false,
            message
        });
    },
    conflict: (res, message) => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send conflict response.');
            return;
        }
        return res.status(HTTP_STATUS.CONFLICT).json({
            success: false,
            message: `⚔️ ${message}`,
            error: 'CONFLICT',
            statusCode: HTTP_STATUS.CONFLICT
        });
    },
    validationError: (res, error) => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send validationError response.');
            return;
        }
        const formattedError = formatError(error);
        formattedError.code = 'VALIDATION_ERROR';
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
            success: false,
            message: `❗ ${formattedError.message}`,
            error: formattedError,
            statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY
        });
    },
    tooManyRequests: (res, message = 'Too many requests', retryAfter = 60) => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send tooManyRequests response.');
            return;
        }
        res.set('Retry-After', retryAfter.toString());
        return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
            success: false,
            message: `🔄 ${message}`,
            error: 'TOO_MANY_REQUESTS',
            retryAfter,
            statusCode: HTTP_STATUS.TOO_MANY_REQUESTS
        });
    },
    internalServerError: (res, error) => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send internalServerError response.');
            return;
        }
        console.error('💥 Internal Server Error:', error);
        const formattedError = formatError(error);
        formattedError.code = 'INTERNAL_SERVER_ERROR';
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `💥 ${formattedError.message}`,
            error: formattedError,
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR
        });
    },
    serviceUnavailable: (res, message = 'Service temporarily unavailable') => {
        if (res.headersSent) {
            console.warn('Headers already sent. Cannot send serviceUnavailable response.');
            return;
        }
        return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
            success: false,
            message: `🛠️ ${message}`,
            error: 'SERVICE_UNAVAILABLE',
            statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE
        });
    }
};

export default responseHandler; 