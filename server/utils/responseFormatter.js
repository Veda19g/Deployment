const formatSuccessResponse = (data) => ({
    success: true,
    data,
  });
  
  const formatErrorResponse = (message) => ({
    success: false,
    error: message,
  });
  
module.exports = { formatSuccessResponse, formatErrorResponse };