import { useEffect, useState } from "react"
import { overflow } from "../overflow"
import Stack from "react-bootstrap/Stack"
import Read from "../assets/Read.png"
import Accept from "../assets/Accept.png"
import Cancel from "../assets/Cancel.png"
import { addAdminLog } from "../adminLog"
/*
overdue (book overdue due to collection/borrowing)
collected (book successfully collected)
UPDATED AND SIMPLFIED DATA TABLE:
id
auditTime
bookISBN
bookName
actionName
readLog
userId (optional)*/
//to read a message, the admin will just have to click on the read icon respectively
const AuditLog = () => {
    useEffect(() => { overflow(true) }, []);
    const [logState, setLogState] = useState("All");
    const [allLogs, getAllLogs] = useState([]);
    useEffect(() => {
        const getLogs = async (state) => {
            if (state === "All") {
                try {
                    const res = await fetch(`http://localhost:5050/adminLogs`)
                    if (!res.ok) throw new Error("Failed to get admin logs! Try again later!");
                    let data = await res.json();
                    getAllLogs(data);
                } catch (e) {
                    console.log(e)
                }
            } else if (state === "Unread") {
                try {
                    const res = await fetch(`http://localhost:5050/adminLogs`)
                    if (!res.ok) throw new Error("Failed to get admin logs! Try again later!");
                    let data = await res.json();
                    data = data.filter(log => log.readLog === false)
                    getAllLogs(data);
                } catch (e) {
                    console.log(e)
                }
            } else if (state == "Read") {
                try {
                    const res = await fetch(`http://localhost:5050/adminLogs`)
                    if (!res.ok) throw new Error("Failed to get admin logs! Try again later!");
                    let data = await res.json();
                    data = data.filter(log => log.readLog === true)
                    getAllLogs(data);
                } catch (e) {
                    console.log(e)
                }
            }
        }
        getLogs(logState);
    }, [logState, allLogs])
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
    const updateLog = async (id) => {
        try {
            let log = new Object();
            log.readLog = true;
            await fetch(`http://localhost:5050/adminLogs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(log)
            });
        } catch (e) {
            console.log(e)
        }
    }
    //both accepted and cancelled need to add the adminLog id from allLogs
    //then when doing adminNoti, change bookISBN to id of the adminLog
    //thats why it was so funky when accepting/cancelling the requests
    const accepted = async (isbn, title, uId, logId) => {
        try {
            let notification = new Object();
            notification.studentId = uId;
            notification.message = `Dear Student, the library book, ${title}, is now ready for collection! Please collect the book within 3 days.`
            notification.messageTime = (new Date()).toISOString();
            let books = await fetch("http://localhost:5050/libraryData");
            books = await books.json();
            books = books.filter((b) => b.identifier == isbn);
            const bookId = books[0].id
            notification.bookId = bookId
            await fetch(`http://localhost:5050/notification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(notification)
            });
            let updatedBook = await fetch("http://localhost:5050/bookInventory");
            updatedBook = await updatedBook.json();
            updatedBook = updatedBook.find((b) => b.studentId == uId);
            let bookIndex = updatedBook.booksIds.indexOf(bookId);
            updatedBook.status[bookIndex] = "Collecting";
            const tdyDate = new Date();
            let dueDate = new Date(tdyDate);
            dueDate.setDate(tdyDate.getDate() + 3);
            dueDate = dueDate.toISOString();
            updatedBook.dueDate[bookIndex] = dueDate;
            updatedBook.requested -= 1;
            await fetch(`http://localhost:5050/bookInventory/${updatedBook.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedBook)
            });
            addAdminLog("accepted", isbn, title);
            let adminNoti = await fetch(`http://localhost:5050/adminLogs`);
            adminNoti = await adminNoti.json();
            adminNoti = adminNoti.slice().reverse().find((n) => n.id == logId);
            await fetch(`http://localhost:5050/adminLogs/${adminNoti.id}`, {
                method: "DELETE"
            })
        } catch (e) {
            console.log(e)
        }
    }
    const cancelled = async (isbn, title, uId, logId) => {
        try {
            let notification = new Object();
            notification.studentId = uId;
            notification.message = `Dear Student, the library book, ${title}, has been rejected for collection by the admin.`
            notification.messageTime = (new Date()).toISOString();
            let books = await fetch("http://localhost:5050/libraryData");
            books = await books.json();
            books = books.filter((b) => b.identifier == isbn);
            const bookId = books[0].id
            notification.bookId = bookId
            await fetch(`http://localhost:5050/notification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(notification)
            });
            let updatedBook = await fetch("http://localhost:5050/bookInventory");
            updatedBook = await updatedBook.json();
            updatedBook = updatedBook.find((b) => b.studentId == uId);
            let bookIndex = updatedBook.booksIds.indexOf(bookId);
            updatedBook.status[bookIndex] = "Cancelled";
            updatedBook.requested -= 1;
            await fetch(`http://localhost:5050/bookInventory/${updatedBook.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedBook)
            });
            addAdminLog("cancelled", isbn, title);
            let adminNoti = await fetch(`http://localhost:5050/adminLogs`);
            adminNoti = await adminNoti.json();
            adminNoti = adminNoti.slice().reverse().find(n => n.id == logId);
            await fetch(`http://localhost:5050/adminLogs/${adminNoti.id}`, {
                method: "DELETE"
            })
        } catch (e) {
            console.log(e)
        }
    }
    const displayLogs = allLogs.slice().reverse().map((log, i) => {
        return (
            <div className="auditMsg text-start d-flex align-items-center">
                <div className="d-flex flex-column">
                    <span style={{ fontWeight: 500 }}>{formatDueDate(log.auditTime)}</span>
                    {(log.actionName === "add" || log.actionName === "edit") ? <text>- Successfully {log.actionName}ed {log.bookName} (ISBN: {log.bookISBN})!</text> : null}
                    {(log.actionName === "delete") ? <text>- Successfully {log.actionName}d {log.bookName} (ISBN: {log.bookISBN})!</text> : null}
                    {log.actionName === "requested" ? <><span>- A request for {log.bookName} (ISBN: {log.bookISBN}) is currently pending confirmation!</span></> : null}
                    {(log.actionName === "cancelled" && log.userId !== undefined) ? <text>- The user has cancelled request for {log.bookName} (ISBN: {log.bookISBN})!</text> : null}
                    {(log.actionName === "cancelled" && log.userId === undefined) ? <text>- Successfully cancelled request for {log.bookName} (ISBN: {log.bookISBN})!</text> : null}
                    {(log.actionName === "accepted") ? <text>- Successfully accepted request for {log.bookName} (ISBN: {log.bookISBN})!</text> : null}
                    {(log.actionName === "overdue") ? <text>- Notice: {log.bookName} (ISBN: {log.bookISBN}) has not been returned by the user of admin number, {log.adminNo}.</text> : null}
                    {(log.actionName === "returned") ? <text>- {log.bookName} (ISBN: {log.bookISBN}) has been returned to the library!</text> : null}
                </div>
                {(!log.readLog && log.actionName !== "requested") ? <img src={Read} type="button" className="ms-auto" width={40} onClick={() => updateLog(log.id)} /> : null}
                {/*From here, add new parameter of log.id in accept + cancel functions*/}
                {log.actionName === "requested" ? <Stack gap={4} className="ms-auto" direction="horizontal"><img type="button" onClick={() => { accepted(log.bookISBN, log.bookName, log.userId, log.id); }} src={Accept} width={30} /><img type="button" onClick={() => { cancelled(log.bookISBN, log.bookName, log.userId, log.id); }} src={Cancel} width={30} /></Stack> : null}
            </div>
        )
    })
    return (
        <div className="Stacks mt-2">
            <h3 className="text-start mb-3">Audit Logs</h3>
            <Stack gap={2} className="auditBtns mb-3" direction="horizontal">
                <button className={logState === "All" ? "active" : ""} onClick={() => setLogState("All")}>All</button>
                <button className={logState === "Unread" ? "active" : ""} onClick={() => setLogState("Unread")}>Unread</button>
                <button className={logState === "Read" ? "active" : ""} onClick={() => setLogState("Read")}>Read</button>
            </Stack>
            <Stack className="mb-3" gap={3}>{allLogs.length > 0 ? displayLogs : <h5>No Audit Logs Here!</h5>}</Stack>
        </div>
    )
}

export default AuditLog
