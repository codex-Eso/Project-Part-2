import { useEffect } from "react";
import { useNavigate } from "react-router";
import NavStudent from '../components/NavStudent'
import NavAdmin from '../components/NavAdmin'
import { getRole } from "../util"

function Admin() {
    const acutalRole = getRole();
    const navigate = useNavigate();
    useEffect(() => {
        if (acutalRole !== "admin") {
            navigate("/")
            return;
        }
    }, [])
    return (
        <div>
            {acutalRole === "student" && <NavStudent />}
            {acutalRole === "admin" && <NavAdmin />}
            <h1>Admin Page</h1>
        </div>
    )
}

export default Admin