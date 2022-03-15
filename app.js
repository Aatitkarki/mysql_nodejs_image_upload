const express = require("express");
const multer = require("multer");
const path = require('path')
const dbConnection = require('./db.js')

const app = express();

app.use('/images', express.static('images'));
app.set('view engine', 'ejs')
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


//Setting Multer Storage Engine
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './images/')
    }
    ,
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }

});

var upload = multer({
    storage: storage
});

app.post('/', upload.single("propImage"), async (req, res) => {

    const name = req.body.propName;
    const price = req.body.propPrice;
    let image = '';
    if (req.file) {
        image = "/images/" + req.file.filename;
    }

    console.log(name)
    console.log(price)
    console.log(image)
    const sqlConnection = await
        dbConnection.getConnection();
    const result = await
        sqlConnection.query("INSERT INTO prop(name,price,imagePath) values(?,?,?)", [name, price, image])
    console.log(result);
    res.redirect('/');
})
app.get('/getAllProp', async (req, res) => {
    const sqlConnection = await
        dbConnection.getConnection();
    const [propsList, fields] = await
        sqlConnection.query("SELECT * FROM prop")
    // console.log(propsList);
    res.render('prop_list', { propsList });
})


app.listen(3000, (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("The app is running")
    }

})