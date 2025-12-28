import { useNavigate } from "react-router-dom"
import logo from "../assets/Logo.png"
import { useEffect, useState } from "react";
import { overflow } from "../overflow";

const Authentication = () => {
    const [user, getUser] = useState({
        adminNo: "",
        password: ""
    });
    const [actualUser, setUser] = useState({});
    useEffect(() => { overflow(false) }, []);
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch("http://localhost:5050/users");
                if (!res.ok) throw new Error("Failed to get users! Try again later!");
                const data = await res.json();
                setUser(data);
            } catch (e) {
                if (e.startsWith("TypeError")) return;
                console.log(e);
            }
        }
        checkLogin();
    })
    const loginBtn = () => {
        var loggedIn = false;
        actualUser.map((u) => {
            //since the admin has only 1 shared account, I just check if it equals to the credentials for the very first array
            if (user.adminNo === "AdminUser2025" && user.password === "Admin_is_user_2025") {
                localStorage.setItem("loginRole", "admin");
                loggedIn = true;
                navigate("/admin");
                return
            } else if (user.adminNo === u.username && user.password === u.password) {
                localStorage.setItem("loginRole", "student");
                localStorage.setItem("userId", u.id);
                navigate("/student");
                loggedIn = true;
                return
            }
        })
        if (!loggedIn) {
            alert("Invalid Login Credentials. Try Again.")
        }
        //login for admin/user upon login
    }
    const navigate = useNavigate();
    return (
        //login UI
        <div className="loginContainer">
            <img id="loginLogo" src={logo} width={"100px"} height={"100px"}></img>
            <text>Login To</text>
            <h4>TP Professor</h4>
            <div className="input">
                <text>Admin Number:</text>
                <br></br>
                <input id="adminNo" type="text" placeholder="E.g.: 2400000E" onChange={(e) => getUser({ ...user, adminNo: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") loginBtn() }}></input>
            </div>
            <div className="input">
                <text>Password:</text>
                <br></br>
                <input id="password" type="password" placeholder="Enter password" onChange={(e) => getUser({ ...user, password: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") loginBtn() }}></input>
            </div>
            <button id="loginBtn" onClick={loginBtn}>
                Login
            </button>
        </div>
    )
}

export default Authentication
