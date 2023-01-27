const notFound = (req, res, next) => {
    // Create a new Error object with a message that includes the original URL of the request
    const error = new Error(`Not Found - ${req.originalUrl}`);
    // Set the response status code to 404
    res.status(404);
    // Call the next middleware function passing the error object as an argument.
    next(error);
};

//------------------------------------------------------------------------------------------------//

const errorHandler = (err, req, res, next) => {
    // Set the status code of the response to either 500 (Internal Server Error) or the current
    // status code of the response, whichever is greater.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    // Send a JSON response with two properties:
    // message, which contains the message of the error
    // stack, which contains the stack trace of the error.
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

// export the functions so they can be used in other parts of the application
module.exports = { notFound, errorHandler };

//------------------------------------------------------------------------------------------------//
//A middleware folder is typically used to store middleware functions in a Node.js 
// application.Middleware functions are functions that are executed in between the client
// 's request and the server's response.They can be used to perform a variety of tasks such 
// as logging, authentication, validation, and error handling.

// The middleware functions that are placed in a middleware folder typically have a specific purpose,
//  such as handling authentication, validation, or error handling.These functions are then imported and 
//  used in the appropriate parts of the application, such as routes or controllers.

// For example, you might have an authentication middleware that checks if a user is logged in before
//  allowing them to access certain routes or pages on the website.Similarly, you might have a validation 
//  middleware that checks if the data sent in a request is valid before allowing the request to continue.

//Having a specific folder for middleware functions helps to keep the code organized and makes it easy to find 
//and understand the middleware functions that are being used in the application.

//Additionally, having a middleware folder allows for easy management of the middleware functions, 
//for example, you can easily disable / enable a middleware by commenting out the import line, 
//or you can change the order of execution of the middleware by changing the order of the imports.