const express = require("express");
const router = express.Router();
const multer = require('multer')
const fs = require('fs')
const authenticate = require('../helpers/auth')

const _mime = require('mime-types')

const upload = multer({
    dest:'images/', 
    limits: {fileSize: 10000000, files: 1},
    fileFilter:  (req, file, callback) => {
    
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {

            return callback(new Error('Only Images are allowed !'), false)
        }

        callback(null, true);
    }
}).single('image')

router.post('/upload/:id', authenticate, (req, res) => {
    // console.log(req)
    upload(req, res, function (err) {

        if (err) {

            res.status(400).json({message: err.message})

        } else {
            let currentFilePath = __dirname + "/../images/" + req.file.filename
            let newName = currentFilePath.replace(req.file.filename,req.params.id) + ".jpeg"
            // console.log(currentFilePath)

            fs.unlink(newName, function(err) {
                if(err && err.code == 'ENOENT') {
                    // file doens't exist
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    // other errors, e.g. maybe we don't have enough permission
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            });


            fs.rename(currentFilePath, newName, function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
            let path = `/images/${req.params.id}.jpeg`
            res.status(200).json({message: 'Image Uploaded Successfully !', path: path})
        }
    })
})

router.get('/:imagename', (req, res) => {
    
    let imagename = req.params.imagename
    let imagepath = __dirname + "/../images/" + imagename
    let image = fs.readFileSync(imagepath)
    // console.log(imagepath)
    let mime = _mime.lookup(imagepath)
    // console.log(mime)
    // console.log(image)
	res.writeHead(200, {'Content-Type': mime })
	res.end(image, 'binary')
    // res.status(200).send(image,'binary')
    // console.log(res)
})

module.exports = router