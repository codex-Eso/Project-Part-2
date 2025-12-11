import { useNavigate } from "react-router"
import { useState } from "react"
import logo from "../assets/Logo.png"

const Authentication = () => {
    const element = document.getElementById("element")
    element.className = "pt-5 text-center";
    //set timeout for smoother logout (to remove nav)
    const [user, getUser] = useState({
        adminNo: "",
        password: ""
    });
    const navigate = useNavigate();
    const userPageStyle = () => {
        element.className = "pt-10 text-center";
    } //display navigation bar
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
                    userPageStyle();
                } else {
                    navigate("/admin")
                    localStorage.setItem("loginRole", "admin");
                    userPageStyle();
                }//login for admin/user upon login
                //MUST MAKE LOGIC BETTER
            }}>
                Login
            </button>
        </div>
    )
}

export default Authentication
