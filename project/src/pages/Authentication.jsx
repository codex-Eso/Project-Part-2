import { useNavigate } from "react-router-dom"
import { useState } from "react"
import logo from "../assets/Logo.png"

const Authentication = () => {
    const [user, getUser] = useState({
        adminNo: "",
        password: ""
    });
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
                <input id="adminNo" type="text" placeholder="E.g.: 2400000E" onChange={(e) => getUser({ ...user, adminNo: e.target.value })}></input>
            </div>
            <div className="input">
                <text>Password:</text>
                <br></br>
                <input id="password" type="password" placeholder="Enter password" onChange={(e) => getUser({ ...user, password: e.target.value })}></input>
            </div>
            <button id="loginBtn" onClick={() => {
                if (user.adminNo === "" && user.password === "") {
                    navigate("/student")
                    localStorage.setItem("loginRole", "student");
                } else {
                    navigate("/admin")
                    localStorage.setItem("loginRole", "admin");
                }//login for admin/user upon login
                //MUST MAKE LOGIC BETTER
            }}>
                Login
            </button>
        </div>
    )
}

export default Authentication
