const http = require('http'),
    static = require('node-static'),
    database = require('./database')

const staticDir = new static.Server('./public')

const getAsyncData = (req, callback) => {
    let data = "";
    req.on("data", chunk=> {data += chunk;});
    req.on("end", () => {callback(data);});
}

const student = (req, res) => {
    const url = req.url.substring(1).split('/')
    switch (req.method) {
        case 'GET':
            if (url.length > 1)
                database.get(res, url[1])
            else
                database.getAll(res)
            break

        case 'POST':
            getAsyncData(req, data => {
                database.create(res, JSON.parse(data))
            })
            break
        case 'PUT':
            getAsyncData(req, data => {
                console.log(data)
                database.update(res, JSON.parse(data))
            })
            break
        case 'DELETE':
            if (url.length > 1) {
                database.delete(res, url[1])
            }
            break

    }
}
const handler = (req, res) => {
    const url = req.url.substring(1).split('/')

    switch (url[0]) {
        case 'student':
            student(req, res)
            break
        default:
            staticDir.serve(req, res)
    }




}

http.createServer(handler).listen(8001)