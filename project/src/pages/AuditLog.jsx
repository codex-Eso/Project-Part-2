import { useEffect, useState } from "react"
import { overflow } from "../overflow"
import Stack from "react-bootstrap/Stack"
const AuditLog = () => {
    useEffect(() => { overflow(false) }, []);
    const [logState, setLogState] = useState("All");
    return (
        <div className="Stacks mt-2">
            <h3 className="text-start mb-3">Audit Logs</h3>
            <Stack gap={2} className="auditBtns" direction="horizontal">
                <button className={logState === "All" ? "active" : ""} onClick={() => setLogState("All")}>All</button>
                <button className={logState === "Unread" ? "active" : ""} onClick={() => setLogState("Unread")}>Unread</button>
                <button className={logState === "Read" ? "active" : ""} onClick={() => setLogState("Read")}>Read</button>
            </Stack>
        </div>
    )
}

export default AuditLog
