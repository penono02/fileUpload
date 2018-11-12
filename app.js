const express = require('express');
const multer = require('multer');
const ejs = require ('ejs');
const path = require('path');
const port = 3000;

//init app
const app = express();

//Setting up ejs
app.set('view engine', 'ejs');

//setting up the static folder that contains your images, files, css, etc..
app.use(express.static('./public'));

//set storage engine for multer
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
       cb (null, file.fieldname + '-' + Date.now() +  path.extname(file.originalname));
  }

});

//initialize the upload
const upload = multer({
  storage: storage,   //pass the storage engine
  limits: {fileSize:1000000},
  fileFilter: function(req,file, cb){
      checkFileType(file, cb);
  }
}).single('myImage')


//Check File type
function checkFileType(file, cb){
   //alowed extensions - regular expressions
   const fileTypes =/jpeg|jpg|png|gif/;
   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  //check mime typeof
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype){
    return cb(null, true);
  }else{
    cb('Error: Image only!');
  }

}


app.get('/', (req, res)=>{

  res.render('index');
});


app.post('/upload', (req, res)=>{

  upload(req, res, (err)=>{
      if (err){
        res.render('index',{
          msg:err
        });
      }else{

          if (req.file==undefined){
            res.render('index',{
              msg: 'Error:  No file Selected'
            });

          }else{
              res.render('index', {
                msg: 'File uploaded!',
               file:`uploads/${req.file.filename}`
              });
          }
      }

  });



});

app.listen(port, ()=>{

  console.log(`Node server running on port ${port}`);

});
