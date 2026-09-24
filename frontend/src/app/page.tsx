'use client';

import { useState, useContext } from "react";
import { login, register } from "../api/authService";
import { MicroserviceContext, ServiceProvider } from "../context/MicroserviceContext";
import { useRouter } from "next/navigation";

function AuthPage() {
  const router = useRouter()
  const context = useContext(MicroserviceContext);
  if (!context) throw new Error("AuthForm must be used within MicroServiceProvider");

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const  {token, user}  = await login(username, password);
        context.dispatch({ type: "SET_AUTH", payload: {user, token}});
        router.replace("/ServiceScreen")
      } else {
        await register(username, password);
        alert("Registration successful! Please log in.");
        setIsLogin(true);
        router.replace("/ServiceScreen")
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="bg-blue-400">
      <form onSubmit={handleSubmit}>
      <h3>{isLogin ? "Sign In" : "Register"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className="p-10 bg-emerald-500" type="submit">{isLogin ? "Login" : "Create Account"}</button>

      <p
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Need an account? Register"
          : "Already have an account? Log in"}
      </p>
    </form>
    </div>
  );
};

export default function Page() {
  return (
    <ServiceProvider>
      <AuthPage />
    </ServiceProvider>
  )
}