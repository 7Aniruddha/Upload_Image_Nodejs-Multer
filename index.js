var express = require('express')
var multer  = require('multer')
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var mongo = require("./models/connection")
var uschema = require("./models/userData.model")

var port = 3000;

var app = express()

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  console.log(JSON.stringify(req.file))
  var response = '<a href="/">Home</a><br>'
  response += "Files uploaded successfully.<br>"
  response += `<img src="${req.file.path}" /><br>`
  return res.send(response)
})

app.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    console.log(JSON.stringify(req.file))
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    for(var i=0;i<req.files.length;i++){
        response += `<img src="${req.files[i].path}" /><br>`
    }
    
    return res.send(response)
})



//---------- (get data from HTML to node server) ----------// 
// app.post("/",upload.none(), (req, res) => {
//   console.log(req.body)
// })

app.use(express.urlencoded({
  extended: true
}));

app.post("/login.html", (req, res) => {
  console.log(req.body)
  //------------------ (mongodb) ------------------//
  var mongodata = new uschema({
    name: req.body.username,
    email: req.body.email,
    password: req.body.pass  
  });

  // mongodata.save();

  mongodata.save(function(err,result){
    if (err){
      // console.log(err);
      console.log("Error occured while saving data!");
    }
    else{
      // console.log(result)
      console.log("Data saved in database")
    }
  })
  //------------------ (mongodb) ------------------//

  res.send("done!")
})

//---------- (get data from HTML to node server) ----------//







//------------------ (JsonWebToken) ------------------//
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
//------------------ (JsonWebToken) ------------------//



app.listen(port,() => console.log(`Server running on port ${port}!`))





