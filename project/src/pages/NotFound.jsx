import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    //edit further later
    return (
        <div>
            <h1>Page Not Found</h1>
            <button onClick={() => {
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
