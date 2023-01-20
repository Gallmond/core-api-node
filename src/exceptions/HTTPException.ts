
class HTTPException extends Error{
    name = 'HTTPException'
    statusCode: number
    statusMessage: string
    constructor(statusCode = 500, statusMessage = 'Something went wrong'){
        super(statusMessage)

        this.statusCode = statusCode
        this.statusMessage = statusMessage
    }
}

export default HTTPException
