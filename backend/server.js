const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()

const HTTP_PORT = 8000
const dbSource = 'UCAssist.db'
const db = new sqlite3.Database(dbSource)

var app = express()
app.use(cors({ 
    origin: "http://localhost",
}))

// get all services 
app.get('/services', (req, res, next) => {
    let strCommand = "SELECT * FROM tblServices"
    db.all(strCommand, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(200).json({
                status: "success",
                message: result
            })
        }
    })
})

app.listen(HTTP_PORT,() => {
    console.log('App listening on',HTTP_PORT)
})