const globalErrorHandler = (err, req, res, next) => {
    // Set default values if not provided
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      // Optionally include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  export default globalErrorHandler;