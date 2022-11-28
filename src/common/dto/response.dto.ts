interface BaseResponse {
    status: number
    message: string
}

export const unAuthorizedResponse: BaseResponse = {
    status: 401,
    message: "Unauthorized"
}


export const validationError: BaseResponse = {
    status: 400,
    message: "something went wrong"
}


export interface UserToken {
    id: string
}