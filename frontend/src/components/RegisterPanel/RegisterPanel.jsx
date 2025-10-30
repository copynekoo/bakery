import { useState } from "react"
import { useNavigate, Link } from '@tanstack/react-router'
import axios from "axios";
import "./RegisterPanel.css"

const RegisterPanel = function() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [result, setResult] = useState("");

  async function handleRegister(e){
    e.preventDefault()
    if (password !== confirmpassword) { alert("Password do not match") }
    else { 
      try {
        const requestBody = {username, password, firstname, lastname};
        await axios.post(import.meta.env.VITE_API_DOMAIN + '/' + 'api' + '/' + 'auth' + '/' + 'register', requestBody);
        navigate({to: '/login'})
      } catch (error) {
        setResult(error?.response?.data?.message || "Registration failed.");
      }
    }

  }

  return (
    <div className="register">
       <form onSubmit={handleRegister}>
        <label htmlFor="username">Username</label><br/>
        <input type="text" id="username" name="username" onChange={e => {setUsername(e.target.value)}}/><br/>
        <label htmlFor="password">Password</label><br/>
        <input type="password" id="password" name="password" onChange={e => {setPassword(e.target.value)}}/><br/>
        <label htmlFor="confirmpassword">Confirm Password</label><br/>
        <input type="password" id="confirmpassword" name="confirmpassword" onChange={e => {setConfirmPassword(e.target.value)}}/><br/>
        <label htmlFor="firstname">First Name</label><br/>
        <input type="text" id="firstname" name="firstname" onChange={e => {setFirstname(e.target.value)}}/><br/>
        <label htmlFor="lastname">Last Name</label><br/>
        <input type="text" id="lastname" name="lastname" onChange={e => {setLastname(e.target.value)}}/><br/>
        <button type="submit">Register</button>
        <div className="result">{result}</div>
      </form>
    </div>
  )
}

export default RegisterPanel
