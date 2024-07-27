class ApiError extends Error { //inheritance (nodejs / express gives an Error class)
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = "" //error stack
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        //just copy:-
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}