import { useEffect, useState } from "react"
import { overflow } from "../overflow"
import { useNavigate } from "react-router-dom";

/*
HEAVY NOTE: ORIGINALLY I WANTED TO ADDED NOTIFICATIONS FOR OVERDUE/BOOK DUE SOON
BUT I WILL NOT BE ADDING THOSE FUNCTIONALITIES, HENCE NO NOTIFICATIONS FOR THOSE
DUE TO TIME CONSTRAINT (OVERDUE/RETURNED IS NOW MAINLY FOR SHOWCASING ONLY WITH NOT MUCH FUNCTIONALITY)
*/

const Notification = () => {
    const navigate = useNavigate();
    useEffect(() => { overflow(true) }, []);
    const [notification, getNotification] = useState([]);
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
            try {
                const res = await fetch(`http://localhost:5050/notification`);
                if (!res.ok) throw new Error("Failed to get notifications! Try again later!");
                let data = await res.json();
                data = data.notification || data;
                data = data.filter(u => u.studentId === localStorage.getItem("userId"));
                getNotification(data);
            } catch (e) {
                console.error(e);
            }
        };
        notifications();
    }, []);
    const navToBook = (id) => {
        navigate(`/student/book/${id}`);
    };
    const notifcationDisplay = notification.slice().reverse().map((n) => {
        return (
            <>
                <div
                    onClick={() => { navToBook(n.bookId); }}
                    className="notifications"
                    type="button"
                    key={n.id}
                >
                    <h5>{formatDueDate(n.messageTime)}</h5>
                    <span>{n.message}</span>
                </div>
                <div className='my-3'></div>
            </>
        );
    });
    return (
        <div className="text-start">
            <h2 className="mb-3">Your Notifications</h2>
            {notification.length === 0 ? (
                <>
                    <span className="mt-3 d-flex justify-content-center align-items-center">No New Notifications!</span>
                </>
            ) : (
                notifcationDisplay
            )}
        </div>
    );
};

export default Notification;