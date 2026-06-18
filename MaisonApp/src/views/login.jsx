import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { HttpService } from "../services/httpService"
import "../main.css"

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            const data = await HttpService.login(username, password);
            if (data.token) {
                localStorage.setItem("authToken", data.token);
            }
            alert("Login successful!");
            navigate("/");
        } catch (err) {
            console.error(err);
            setErrorMsg(err.message || "Invalid username or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Sign in to your Maison account</p>

                {errorMsg && (
                    <div className="auth-error-box">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="auth-field">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter password"
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="auth-switch-link">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    )
}