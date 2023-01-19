import { RequestHandler } from 'express'

export const helloWorld: RequestHandler = (req, res) => {
    res.json({foo: 'bar', ...req.body})
}
