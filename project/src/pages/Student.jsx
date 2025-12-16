import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import NavStudent from '../components/NavStudent'
import NavAdmin from '../components/NavAdmin'
import { getRole } from "../checkLogin"

function Student() {
    const acutalRole = getRole();
    const navigate = useNavigate();
    useEffect(() => {
        if (acutalRole !== "student") {
            navigate("/")
            return;
        }
    }, [])
    return (
        <div className="pt-10 text-center">
            {acutalRole === "student" && <NavStudent />}
            {acutalRole === "admin" && <NavAdmin />}
            <Outlet />
        </div>
    )
}

export default Student