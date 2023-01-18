import express from 'express'

const app = express()

app.use(express.json())

app.get('/hello-world', (req, res) => {
    res.json({foo: 'bar', ...req.body})
})

export default app