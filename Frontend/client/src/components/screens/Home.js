import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'

const Home=()=>{
    const [data,setData]=useState([])
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization": "token " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            setData(result.posts)
        })
    },[])

    const likePost=(id)=>{
        fetch('/like',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"token "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            //result means the updated post
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setData(newdata)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const unlikePost=(id)=>{
        fetch('/unlike',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"token "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log("result: "+JSON.stringify(result))
            // console.log("item: "+JSON.stringify(data[0]))
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            //newdata means the entire updated array consisting of all the posts of every user in the home page.
            setData(newdata)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const makeComment=(text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"token "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newdata)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const [currentPost,setCurrentPost]=useState("")

    return (
        <div className="home">
            {
                data.map(item=>{
                    return (
                        <div key={item._id} className="card home-card">
                            <h5 style={{color:"grey",fontFamily:'cursive'}}>Posted by {item.postedBy.name}</h5>
                            <div className="card-image">
                                <img src={item.photo}/>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color: "red"}}>favorite</i>
                                {
                                    item.likes.includes(state._id)
                                    ?
                                    <i className="material-icons" style={{cursor: 'pointer'}} onClick={()=>{unlikePost(item._id)}}>thumb_down</i>
                                    :
                                    <i className="material-icons" style={{cursor: 'pointer'}} onClick={()=>{likePost(item._id)}}>thumb_up</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    (item._id==currentPost) 
                                    ?
                                    item.comments.map(record=>{
                                        return (
                                            <h6 key={record._id}><span style={{fontWeight:"700"}}>{record.postedBy.name} </span>{record.text}</h6>
                                        )
                                    })
                                    :
                                    <p style={{fontWeight:"300"}}>Click on show below to check comments..</p>
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                    e.target[0].value=""//I added this line
                                }}>
                                    <input type="text" placeholder="Add a comment"/>
                                    {
                                        (item._id==currentPost)
                                        ?
                                        <button type="button" class="btn btn-primary" onClick={()=>{setCurrentPost("")}}>Hide</button>
                                        :
                                        <button type="button" class="btn btn-primary" onClick={()=>{setCurrentPost(item._id)}}>Show</button>
                                    }
                                    
                                </form>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default Home