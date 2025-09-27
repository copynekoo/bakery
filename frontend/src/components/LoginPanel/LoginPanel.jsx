import { useState } from "react"
import { useNavigate, Link } from '@tanstack/react-router'
import axios from "axios";
import "./LoginPanel.css"

const LoginPanel = function() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e){
    e.preventDefault()
    try {
      const requestBody = {username, password};
      const response = await axios.post(import.meta.env.VITE_API_DOMAIN + '/' + 'api' + '/' + 'auth' + '/' + 'login', requestBody);
      document.cookie = `token=${response.data.token}; path=/; SameSite=Strict`;
      navigate({to: '/'})
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="login">
       <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label><br/>
        <input type="text" id="username" name="username" onChange={e => {setUsername(e.target.value)}}/><br/>
        <label htmlFor="password">Password</label><br/>
        <input type="password" id="password" name="password" onChange={e => {setPassword(e.target.value)}}/><br/>
        <button type="submit">Sign In</button>
        <Link to="/register" className="[&.active]:font-bold register">Register an account</Link>
      </form>
    </div>
  )
}

export default LoginPanel