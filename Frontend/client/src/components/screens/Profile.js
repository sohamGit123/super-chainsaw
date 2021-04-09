import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

const Profile=()=>{
    const [mypics,setpics]=useState([])
    const {state,dispatch}=useContext(UserContext)
    console.log("state becomes: "+state)
    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                "Authorization":"token "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setpics(result.myposts)
        })
    },[])
    return (
        <div style={{
            maxWidth: "550px", margin: "0px auto"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img style={{width: "160px", height: "160px", borderRadius: "80px"}}
                    src="https://images.unsplash.com/photo-1609439408825-b2a24e29871f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80"
                    />
                </div>
                <div>
                    <h4>{state?state.name:"loading..."}</h4>
                    <div style={{display: "flex", justifyContent: "space-between", width:"108%"}}>
                        <h6>40 posts</h6>
                        <h6>80k followers</h6>
                        <h6>65k followings</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map((item)=>{
                        return (
                            <img key={item._id} className="item" src={item.photo}/>
                        )
                    })
                }
                
            </div>
        </div>
    )
}

export default Profile