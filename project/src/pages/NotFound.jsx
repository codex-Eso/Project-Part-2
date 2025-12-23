import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { overflow } from "../overflow"
import Bad from "../assets/Bad.png"

const NotFound = () => {
    const navigate = useNavigate();
    useEffect(() => { overflow(false) }, []);
    return (
        <div className="mt-5 d-flex flex-column justify-content-center align-items-center">
            <h3 className="mb-3">Page Not Found</h3>
            <img src={Bad} width={200} />
            <br />
            <button id="home" onClick={() => {
                if (localStorage.getItem("loginRole") === "student") {
                    navigate("/student")
                } else if (localStorage.getItem("loginRole") === "admin") {
                    navigate("/admin")
                }
            }}>Back To Home Page</button>
        </div>
    )
}

export default NotFound
