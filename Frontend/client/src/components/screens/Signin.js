import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'
const Signin=()=>{
    const {state,dispatch}=useContext(UserContext)
    const history=useHistory()
    const [password,setPassword]=useState("")
    const [email,setEmail]=useState("")
    const PostData=()=>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email) && email!==""){
            M.toast({html: "invalid email",classes: "#c62828 red darken-3"})
            return
        }
        fetch("/signin",{
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"signed in successfully",classes:"#43a047 green darken-1"})
                history.push('/')
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2 style={{color: "rgb(95,158,160)"}}>Explore</h2>
                <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button class="btn waves-effect waves-light" onClick={PostData}>
                    Login
                </button>
                <p>
                    <Link to='/signup'><p style={{color: "rgb(72,72,72)"}}>Don't have an account?</p></Link>
                </p>
            </div>
        </div>
    )
}

 export default Signin