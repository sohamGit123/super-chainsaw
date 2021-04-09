const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const requireLogin=require('../middleware/requireLogin')
const Post=mongoose.model("Post")
router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic}=req.body
    if(!title || !body || !pic){
      return  res.status(422).json({error: "Please add all the fields"})
    }
    req.user.password=undefined
    const post=new Post({
        title: title,
        body: body,
        photo: pic,
        postedBy: req.user
    })
    post.save().then(result=>{
        res.json({post: result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")//sorting the posts according to timestamps
    .then(posts=>{
        //console.log(posts)
        res.json({posts: posts})
    })
    .catch(err=>{
        console.log(err)
    })
    // console.log("temp---->>>>  "+Post.find().then())
})

router.get('/myPosts',requireLogin,(req,res)=>{
    Post.find({postedBy: req.user._id})
    .populate('postedBy','_id name')
    .then(myposts=>{
        res.json({myposts})
    })
    .catch(err=>{
        console.log("error in retreiving your posts")
    })
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes: req.user._id}
    },{
        new: true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            console.log("After Liking Post")
            console.log(result)
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes: req.user._id}
    },{
        new: true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment={
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments: comment}
    },{
        new: true
    })
    .populate("postedBy","_id name")// Atfirst this needs to be populated.
    .populate("comments.postedBy","_id name")//   Now this should be populated.
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})



module.exports=router


// {
//     "name":"Test2",
//     "email": "test2@gmail.com",
//     "password":"Test2"
// }

// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDBiYjUxYzkwY2VjZTIzNzAwZTUxMDQiLCJpYXQiOjE2MTEzODAwODB9.q8lQ-Rxu2tZRoBYoaFOpFgsER8Zu9xM_pQ6v4t6QVRI"
// }




// {
//     "name":"Test",
//     "email": "test@gmail.com",
//     "password":"Test"
// }

// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDBiYjQ5MDkwY2VjZTIzNzAwZTUxMDMiLCJpYXQiOjE2MTEzODAxODh9.11okFyQo8Mfn4B3-06MzVJKeQbNNaCFFcKHwf4rGLXY"
// }