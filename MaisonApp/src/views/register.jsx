import { useState, useEffect } from "react";
import { HttpService } from "../services/httpService";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [user, setUser] = useState({ username: "", email: "", password: "" });
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const register = async function (e) {
        if (e) e.preventDefault();
        setErrorMsg("");
        try {
            const res = await HttpService.register(
                user.username,
                user.email,
                user.password,
            );
            localStorage.setItem("authToken", res.token);
            navigate("/");
        } catch (error) {
            setErrorMsg(error.message);
        }
    }

    return (
        <>
            <div className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join Maison to curator your objects</p>
                    {errorMsg && (
                        <div className="auth-error-box">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={register} className="auth-form">
                        <div className="auth-field">
                            <label htmlFor="username">Username</label>
                            <input type="text" onChange={(e) => setUser({ ...user, username: e.target.value })} value={user.username || ""} required placeholder="Choose a username" />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" onChange={(e) => setUser({ ...user, email: e.target.value })} value={user.email || ""} required placeholder="Enter email" />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">Password</label>
                            <input type="password" onChange={(e) => setUser({ ...user, password: e.target.value })} value={user.password || ""} required placeholder="Create a password" />
                        </div>

                        <button type="submit" className="auth-submit-btn">Sign Up</button>
                    </form>

                    <p className="auth-switch-link">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>

        </>
    );
}