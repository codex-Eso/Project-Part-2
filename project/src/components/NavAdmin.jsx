import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, useNavigate } from "react-router-dom"
import logo from "../assets/Logo.png"

const NavAdmin = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("loginRole");
        navigate("/")
    }
    return (
        <Navbar className='my-nav-bar' variant='dark' expand="lg" fixed="top">
            <Container>
                <Navbar.Brand><img alt="" src={logo} width="70" height="60" /><br />TP Professor</Navbar.Brand>
                <Navbar.Toggle></Navbar.Toggle>
                <Navbar.Collapse>
                    <Nav className='me-auto'>
                        <Nav.Link as={Link} to="/admin/logs">Audit Log</Nav.Link>
                        <Nav.Link as={Link} to="/admin/addBook">Add Book</Nav.Link>
                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavAdmin