const {Router} = require('express');
const  multer = require('multer');
const path = require('path');
const Blog = require('../models/Blog'); 


const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, path.resolve(`public/uploads/`));
        },
    filename: function (req, file, cb) {  
        const fileName = `${Date.now()}-${file.originalname}`;   
        cb(null, fileName);
    }
}); 
const upload = multer({ storage: storage });

router.get('/addblog', (req, res) => {
    res.render('addblog',
         {user: req.user});
});

router.post('/addblog', upload.single("coverImage"), async(req, res) => {
    const {title, body} = req.body;
  const blog =  await Blog.create({
        title,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id
    });
    return res.redirect(`/blog/${blog._id}`);
});
module.exports = router;