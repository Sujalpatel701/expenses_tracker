import { useState } from "react";
import "./auth.css";

function Auth({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleAuth(event) {
    event.preventDefault();
  
    const endpoint = isLogin ? "http://localhost:3000/api/login" : "http://localhost:3000/api/signup";
  
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
    console.log("Response from server:", data);
  
    if (response.ok && isLogin) {
      localStorage.setItem("isAuthenticated", "true"); 
      localStorage.setItem("userEmail", email); // Store user email
      setIsAuthenticated(true);
    }
  }
  

  return (
    <main>
      <h1 className="big-amount">{isLogin ? "Login" : "Sign Up"}</h1>

      {message && <p>{message}</p>}

      <form onSubmit={handleAuth}>
        <input
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          placeholder="Password"
          required
        />

        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>

      <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
      <div>
        <button className="switch" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </div>
    </main>
  );
}

export default Auth;
