import { overflow } from "../overflow"
import { useEffect, useState } from "react";
import Stack from "react-bootstrap/Stack"
import { useNavigate } from "react-router-dom";
import NoBooks from "../components/NoBooks";
/*
All books (recently viewed)
Borrowed
+ Overdue (with due date)
Requested (user can cancel request)
Collecting (with due date)
Cancelled
*/
const formatDueDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-SG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
const Inventory = () => {
    const navigate = useNavigate();
    useEffect(() => { overflow(true) }, []);
    const [state, setState] = useState("All");
    const [books, getBooks] = useState({});
    const [allBooks, getAllBooks] = useState([]);
    const [availableCheck, setAvailableCheck] = useState(false);
    const [unavailableCheck, setUnavailableCheck] = useState(false);
    let displayBooks;
    const navToBook = (id) => {
        navigate(`/student/book/${id}`);
    }
    useEffect(() => {
        const bookInventory = async () => {
            try {
                const res = await fetch(`http://localhost:5050/bookInventory`);
                if (!res.ok) throw new Error("Failed to get books! Try again later!");
                let data = await res.json();
                data = data.filter(u => u.studentId === localStorage.getItem("userId"));
                getBooks(data[0]);
            } catch (e) {
                alert(e);
            }
        }
        const libraryBooks = async () => {
            try {
                const res = await fetch(`http://localhost:5050/libraryData`);
                if (!res.ok) throw new Error("Failed to get books! Try again later!");
                let data = await res.json();
                getAllBooks(data);
            } catch (e) {
                alert(e);
            }
        }
        libraryBooks();
        bookInventory();
    }, [state])
    displayBooks = books.booksIds?.map((id, idx) => ({
        id,
        status: books.status[idx],
        dueDate: books.dueDate[idx]
    }))
        .filter(book => {
            const matchedBook = allBooks.find(b => b.id === book.id);
            if (!matchedBook) return false;
            if (state !== "All" && book.status !== state) return false;
            if (availableCheck && unavailableCheck) return true;
            if (availableCheck && !matchedBook.availability) return false;
            if (unavailableCheck && matchedBook.availability) return false;
            return true;
        })
        .map(book => {
            const matchedBook = allBooks.find(b => b.id === book.id);
            if (!matchedBook) return null;
            return (
                <div
                    id="bookInfo"
                    onClick={() => navToBook(matchedBook.id)}
                    className="ViewedBox"
                    key={book.id}
                >
                    <img src={matchedBook.bookImage} />
                    <div className="d-flex flex-column text-start fs-6 ps-3">
                        <span>{matchedBook.title}</span>
                        <span>By {matchedBook.author}</span>
                        {matchedBook.availability
                            ? <span className="text-success">Available</span>
                            : <span className="text-danger">Unavailable</span>}
                        <span>Status: {book.status}</span>
                        {(book.status === "Borrowed") && (
                            <span>Return By: {formatDueDate(book.dueDate)}</span>
                        )}
                        {(book.status === "Collecting") && (
                            <span>Collect By: {formatDueDate(book.dueDate)}</span>
                        )}
                        {(book.status === "Overdue") && (
                            <span className="text-danger">Return By: {formatDueDate(book.dueDate)}</span>
                        )}
                    </div>
                </div>
            );
        });
    return (
        <Stack className="Stacks" direction="horizontal">
            <div className="mb-auto">
                <h5 type="button" onClick={() => { setState("All"); }} className="mt-3 d-flex justify-content-start">All</h5>
                <h5 type="button" onClick={() => { setState("Borrowed"); }} className="mt-3 d-flex justify-content-start">Borrowed</h5>
                <h5 type="button" onClick={() => { setState("Requested"); }} className="mt-3 d-flex justify-content-start">Requested</h5>
                <h5 type="button" onClick={() => { setState("Collecting"); }} className="mt-3 d-flex justify-content-start">Collecting</h5>
                <h5 type="button" onClick={() => { setState("Returned"); }} className="mt-3 d-flex justify-content-start">Returned</h5>
                <h5 type="button" onClick={() => { setState("Overdue"); }} className="mt-3 d-flex justify-content-start">Overdue</h5>
                <h5 type="button" onClick={() => { setState("Cancelled"); }} className="mt-3 d-flex justify-content-start">Cancelled</h5>
                <h5 className="mt-3 d-flex justify-content-start">Filter By:</h5>
                <label className="d-flex align-items-center" for="available">
                    <input type="checkbox" id="available" name="available" onChange={(e) => setAvailableCheck(e.target.checked)} /> <span className=" ms-1 d-inline">Available</span>
                </label>
                <label className="d-flex align-items-center" for="unavailable">
                    <input type="checkbox" id="unavailable" name="unavailable" onChange={(e) => setUnavailableCheck(e.target.checked)} /> <span className=" ms-1 d-inline">Unavailable</span>
                </label>
            </div>
            <div className="bookInventory ms-5 my-3">
                {displayBooks}
                {(!displayBooks || displayBooks.length === 0) && (<div style={{ marginLeft: "25rem" }}><NoBooks /></div>)}
            </div>
        </Stack>
    )
}

export default Inventory