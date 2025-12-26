import { Navbar, Nav, Container, Modal } from 'react-bootstrap'
import { NavLink, useNavigate } from "react-router-dom"
import logo from "../assets/Logo.png"
import { useEffect, useState } from 'react'

const NavStudent = () => {
    const navigate = useNavigate();
    const [show, checkToShow] = useState(false);
    const [notification, getNotification] = useState([]);
    const logout = () => {
        localStorage.removeItem("loginRole");
        localStorage.removeItem("userId");
        navigate("/");
    }
    const formatDueDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-SG", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    useEffect(() => {
        const notifications = async () => {
            let data;
            try {
                const res = await fetch(`http://localhost:5050/notification`);
                if (!res.ok) throw new Error("Failed to get notifications! Try again later!");
                data = await res.json();
                data = data.filter(u => u.studentId === localStorage.getItem("userId"));
                getNotification(data);
            } catch (e) {
                console.error(e);
            }
        }
        notifications();
    }, [notification])
    const navToBook = (id) => {
        navigate(`/student/book/${id}`);
        document.getElementById("notification").style.textDecoration = "none";
    }
    const notifcationDisplay = notification.slice().reverse().map((n, index) => {
        return (
            <>
                <div onClick={() => { navToBook(n.bookId); checkToShow(false) }} className='noti' type="button" key={n.id}>
                    <span>{formatDueDate(n.messageTime)}</span>
                    <br></br>
                    <span className='notiMsg'>{n.message}</span>
                </div>
                {!(index === notification.length - 1) && <div className='my-3'></div >}
            </>
        );
    })
    return (
        <>
            <Navbar className='my-nav-bar' variant='dark' expand="lg" fixed="top">
                <Container>
                    <Navbar.Brand><img alt="" src={logo} width="70" height="60" /><br />TP Professor</Navbar.Brand>
                    <Navbar.Toggle></Navbar.Toggle>
                    <Navbar.Collapse>
                        <Nav className='me-auto'>
                            <Nav.Link onClick={() => document.getElementById("notification").style.textDecoration = "none"} as={NavLink} to="/student" end>Home</Nav.Link>
                            <Nav.Link onClick={() => document.getElementById("notification").style.textDecoration = "none"} as={NavLink} to="/student/inventory">Your Books</Nav.Link>
                            <Nav.Link id='notification' onClick={() => { checkToShow(true); document.getElementById("notification").style.textDecoration = "underline"; }}>Notification</Nav.Link>
                            <Nav.Link onClick={() => { logout(); document.getElementById("notification").style.textDecoration = "none"; }}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Modal show={show} onHide={() => { checkToShow(false); document.getElementById("notification").style.textDecoration = "none"; }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {notification.length > 0 ? notifcationDisplay : <>
                        <div className='text-center'>
                            No New Notifications!
                        </div>
                    </>}
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <text type='button' className='text-decoration-underline' onClick={() => { checkToShow(false); navigate("/student/notification"); }}>
                        See More
                    </text>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default NavStudent