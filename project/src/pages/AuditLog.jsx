import { useEffect, useState } from "react"
import { overflow } from "../overflow"
import Stack from "react-bootstrap/Stack"
/*add (books)
edit (books)
delete (books)
requested (from the user)
accepted (by admin to user)
overdue (book overdue due to collection/borrowing)
collected (book successfully collected)
cancellation (book request cancelled by user/admin)
UPDATED AND SIMPLFIED DATA TABLE:
id
auditTime
bookISBN
bookName
actionName
readLog*/
//to read a message, the admin will just have to click on the messages respectively
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
                    alert(e);
                }
            } else if (state === "Unread") {
                try {
                    const res = await fetch(`http://localhost:5050/adminLogs`)
                    if (!res.ok) throw new Error("Failed to get admin logs! Try again later!");
                    let data = await res.json();
                    data = data.filter(log => log.readLog === false)
                    getAllLogs(data);
                } catch (e) {
                    alert(e);
                }
            } else if (state == "Read") {
                try {
                    const res = await fetch(`http://localhost:5050/adminLogs`)
                    if (!res.ok) throw new Error("Failed to get admin logs! Try again later!");
                    let data = await res.json();
                    data = data.filter(log => log.readLog === true)
                    getAllLogs(data);
                } catch (e) {
                    alert(e);
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
            alert(e);
        }
    }
    const displayLogs = allLogs.map((log, i) => {
        return (
            <div onClick={() => updateLog(log.id)} className="auditMsg text-start d-flex flex-column" type="button">
                <span style={{ fontWeight: 500 }}>{formatDueDate(log.auditTime)}</span>
                {(log.actionName === "add" || log.actionName === "edit") ? <text>- Successfully {log.actionName}ed {log.bookName} (ISBN: {log.bookISBN})!</text> : null}
                {(log.actionName === "delete") ? <text>- Successfully {log.actionName}d {log.bookName} (ISBN: {log.bookISBN})!</text> : null}
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
            <Stack gap={3}>{allLogs.length > 0 ? displayLogs : <h5>No Admin Logs Here!</h5>}</Stack>
        </div>
    )
}

export default AuditLog
