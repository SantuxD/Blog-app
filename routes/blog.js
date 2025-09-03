const {Router} = require('express');
const  multer = require('multer');
const path = require('path');
const Blog = require('../models/Blog'); 
const requireAuth = require('../middlewares/auth');
const Comment = require('../models/comment');


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

router.post('/addblog',  upload.single("coverImageURL"), async(req, res) => {
    const {title, body} = req.body;
  const blog =  await Blog.create({
        title,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id", async(req, res) =>{
try {
    const blog = await Blog.findById(req.params.id).populate('createdBy', 'fullName profileImageURL'
    );
    console.log(blog);
    if(!blog){
        return res.status(404).send('Blog not found');
    }
    const comments = await Comment.find({ blog: blog._id })
      .populate("createdBy", "fullName profileImageURL")
      .sort({ createdAt: -1 });

    return res.render('blog',{
        blog,
        user: req.user,
        comments,

    
});  
} catch(error) {
    console.error(error);
    res.status(500).send('Server error');
  } 

});

router.post("/comment/:blogid", async(req, res) =>{
   await Comment.create({
        content: req.body.content,
        createdBy: req.user._id,
        blogId: req.params.blogId,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});


module.exports = router;