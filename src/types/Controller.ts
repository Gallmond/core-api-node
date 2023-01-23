import { RequestHandler } from 'express'

type Method = 'get' | 'post' | 'delete'
type Route = [Method, string, RequestHandler]

export {
    Method, Route
}
