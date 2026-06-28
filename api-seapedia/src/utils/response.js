export const sendResponse = (res, statusCode, message, data = null, metadata = null) => {
    const response = {
        success: statusCode >= 200 && statusCode < 300,
        message,
    };
    
    if (data) {
        response.data = data;
    }
    
    response.metadata = metadata || { status: statusCode };
    
    return res.status(statusCode).json(response);
};
