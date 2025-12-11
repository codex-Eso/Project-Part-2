import { useEffect } from "react";
import { useNavigate } from "react-router";
import NavStudent from '../components/NavStudent'
import NavAdmin from '../components/NavAdmin'

function Student() {
    const acutalRole = localStorage.getItem("loginRole");
    const navigate = useNavigate();
    useEffect(() => {
        if (acutalRole !== "student") {
            navigate("/")
            return;
        }
    }, [])
    return (
        <div>
            {acutalRole === "student" && <NavStudent />}
            {acutalRole === "admin" && <NavAdmin />}
            <h1>Student Page</h1>
        </div>
    )
}

export default Student