const express = require('express')
const app = express()
const mysql = require('mysql')
const multer = require('multer')
const path = require('path')


//use express static folder
app.use(express.static("./public"))
app.use('/public/images', express.static('images'));
// body-parser middleware use
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "image_upload_test"
})

db.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
})

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        // console.log("THe file destination data is")
        // console.log(file)
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        // console.log("THe file name is")
        // console.log(file)
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});

//! Routes start

//route for Home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//@type   POST
//route for post data
app.post("/post", upload.array('image'), (req, res) => {
    console.log(req.files)
    if (!req.files) {
        console.log("No file upload");
    } else {
        // console.log(req.file)
        var imgsrc = '/images/' + req.file.filename
        var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
        db.query(insertData, [imgsrc], (err, result) => {
            if (err) throw err
            console.log("file uploaded")
            res.json({ message: "File Uploaded Successfully" })
        })
    }
});

//create connection
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))