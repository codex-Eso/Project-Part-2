import { useEffect, useState } from "react"
import { useParams } from "react-router"
import Stack from "react-bootstrap/esm/Stack";
import Close from "../assets/Close.png";
import Carousel from "react-bootstrap/Carousel";
import { useNavigate } from "react-router-dom";
import { getRole } from "../checkLogin";
import { overflow } from "../overflow";
import { addAdminLog } from "../adminLog";

const BookInfo = () => {
    const { id } = useParams();
    const [book, actualBook] = useState({});
    const [bookState, setBookState] = useState(null);
    const [borrowedCount, setBorrowedCount] = useState(0);
    const [requestedCount, setRequestedCount] = useState(0);
    const navigate = useNavigate();
    useEffect(() => { overflow(false) }, []);
    useEffect(() => { }, [id]);
    useEffect(() => {
        const getBookInfo = async () => {
            try {
                //GET libraryData
                const res = await fetch(`http://localhost:5050/libraryData/${id}`);
                if (!res.ok) throw new Error("Failed to get book! Try again later!");
                let data = await res.json();
                actualBook(data);
            } catch (e) {
                navigate("error");
            }
        }
        getBookInfo()
    })
    useEffect(() => {
        const getUserBooks = async () => {
            try {
                if (getRole() === "admin") {
                    //GET adminBooks
                    const res = await fetch(`http://localhost:5050/adminBooks`);
                    if (!res.ok) throw new Error("Failed to get books! Try again later!");
                    let data = await res.json();
                    const getBook = data[0].bookIds.indexOf(id);
                    if (getBook !== -1) {
                        data[0].bookIds.splice(getBook, 1);
                        data[0].bookIds.unshift(id);
                    } else {
                        data[0].bookIds.unshift(id);
                    }
                    //PATCH adminBooks
                    await fetch(`http://localhost:5050/adminBooks/AB1`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data[0])
                    });
                } else if (getRole() === "student") {
                    //GET bookInventory
                    const res = await fetch(`http://localhost:5050/bookInventory`);
                    if (!res.ok) throw new Error("Failed to get books! Try again later!");
                    let data = await res.json();
                    data = data.filter(u => u.studentId === localStorage.getItem("userId"));
                    const getBook = data[0].booksIds.indexOf(id);
                    if (getBook !== -1) {
                        data[0].booksIds.splice(getBook, 1);
                        data[0].booksIds.unshift(id);
                        var getStatus = data[0].status.splice(getBook, 1);
                        data[0].status.unshift(getStatus[0]);
                        var getDueDate = data[0].dueDate.splice(getBook, 1);
                        data[0].dueDate.unshift(getDueDate[0]);
                    } else {
                        data[0].booksIds.unshift(id);
                        data[0].status.unshift("Viewed");
                        data[0].dueDate.unshift("");
                    }
                    setBookState(data[0].status[0]);
                    setBorrowedCount(data[0].borrowed);
                    setRequestedCount(data[0].requested);
                    //PATCH bookInventory
                    await fetch(`http://localhost:5050/bookInventory/${data[0].id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data[0])
                    });
                }
            } catch (e) {
                console.log(e);
            }
        }
        getUserBooks();
    }, [id])
    const action = (getAction) => {
        if (getRole() === "student") {
            if (book.location === "Closed Stacks" && getAction === "Borrow") {
                alert("Cannot proceed! Cannot borrow books from closed stacks!");
                return;
            }
            if (bookState === "Viewed" || bookState === "Cancelled" || bookState === "Returned") {
                if (getAction === "Borrow") {
                    if (!book.availability) {
                        alert("Cannot proceed! Book unavailable. Try again soon!");
                        return;
                    }
                    if (borrowedCount === 30) {
                        alert("Cannot proceed! You have exceeded your borrowing limits!");
                        return;
                    }
                    //prompt to enter ISBN
                    const checkISBN = prompt("To confirm borrowing, please enter the book's ISBN:\n");
                    if (checkISBN == book.identifier) {
                        const bookBorrowed = async () => {
                            const tdyDate = new Date();
                            let dueDate = new Date(tdyDate);
                            dueDate.setDate(tdyDate.getDate() + 28);
                            dueDate = dueDate.toISOString();
                            //GET bookInventory
                            const res = await fetch(`http://localhost:5050/bookInventory`);
                            if (!res.ok) throw new Error("Failed to get books! Try again later!");
                            let userBook = await res.json();
                            userBook = userBook.filter(u => u.studentId === localStorage.getItem("userId"));
                            let getId = userBook[0].booksIds.indexOf(id);
                            userBook[0].status[getId] = "Borrowed";
                            userBook[0].dueDate[getId] = dueDate;
                            userBook[0].borrowed += 1;
                            //PATCH bookInventory
                            await fetch(`http://localhost:5050/bookInventory/${userBook[0].id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(userBook[0])
                            });
                            const updatedBook = { ...book };
                            updatedBook.copies -= 1;
                            if (updatedBook.copies === 0) updatedBook.availability = false;
                            //PATCH libraryData
                            await fetch(`http://localhost:5050/libraryData/${id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(updatedBook)
                            });
                            actualBook(updatedBook);
                            let jsonData = new Object();
                            jsonData.studentId = localStorage.getItem("userId");
                            jsonData.message = `Dear Student, the library book, ${book.title}, has been successfully borrowed! Make sure to return the book back to the library after 4 weeks!`
                            let getDate = new Date();
                            jsonData.messageTime = getDate.toISOString();
                            jsonData.bookId = id;
                            //POST notification
                            await fetch(`http://localhost:5050/notification`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(jsonData)
                            });
                            setBookState("Borrowed");
                        }
                        bookBorrowed();
                        alert("Borrowed successfully!");
                    } else {
                        alert("Cannot proceed! Invalid ISBN!");
                    }
                } else if (getAction === "Request") {
                    if (requestedCount === 10) {
                        alert("Cannot proceed! You have exceeded your requesting limits!");
                        return;
                    }
                    const bookRequested = async () => {
                        //GET bookInventory
                        const res = await fetch(`http://localhost:5050/bookInventory`);
                        if (!res.ok) throw new Error("Failed to get books! Try again later!");
                        let userBook = await res.json();
                        userBook = userBook.filter(u => u.studentId === localStorage.getItem("userId"));
                        let getId = userBook[0].booksIds.indexOf(id);
                        userBook[0].status[getId] = "Requested";
                        userBook[0].requested += 1;
                        //PATCH bookInventory
                        await fetch(`http://localhost:5050/bookInventory/${userBook[0].id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(userBook[0])
                        });
                        let jsonData = new Object();
                        jsonData.studentId = localStorage.getItem("userId");
                        jsonData.message = `Dear Student, the library book, ${book.title}, has been successfully requested! Waiting might take a longer than a week if all available copies are taken.`
                        let getDate = new Date();
                        jsonData.messageTime = getDate.toISOString();
                        jsonData.bookId = id;
                        //POST notification
                        await fetch(`http://localhost:5050/notification`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(jsonData)
                        });
                        setBookState("Requested");
                        addAdminLog("requested", book.identifier, book.title, localStorage.getItem('userId'));
                    }
                    bookRequested();
                    alert("Requested successfully!");
                }
            } else {
                if (bookState === "Borrowed" || bookState === "Overdue") {
                    alert("Cannot proceed! You still have the book in your possession!");
                } else if (bookState === "Requested") {
                    alert("Cannot proceed! Book has already been requested!");
                } else if (bookState === "Collecting") {
                    alert("Cannot proceed! The book is currently ready for your collection!");
                }
            }
        } else if (getRole() === "admin") {
            if (getAction === "Edit") {
                navigate(`/admin/editBook/${id}`)
            } else if (getAction === "Delete") {
                let confirmDeletion = prompt(`Confirm Deletion?\nEnter "Yes" to continue:`)
                if (confirmDeletion.toLowerCase() === "yes") {
                    const deletion = async () => {
                        try {
                            let bookISBN = book.identifier
                            let bookName = book.title
                            //DELETE libraryData
                            await fetch(`http://localhost:5050/libraryData/${id}`, {
                                method: "DELETE"
                            })
                            alert("Book deleted!")
                            navigate(-1);
                            addAdminLog("delete", bookISBN, bookName);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    deletion();
                } else {
                    alert("Deletion cancelled!")
                }
            }
        }
    }
    return (
        <div className="fs-5 mt-3 bookInfo">
            <img id="exitBook" onClick={() => {
                navigate(-1);
            }} src={Close} width={30} height={30} />
            <Carousel slide={false}>
                <Carousel.Item>
                    <img className="displayImg" src={book.bookImage} />
                </Carousel.Item>
                {(book.location !== "Closed Stacks") ? <Carousel.Item>
                    <img className="displayImg" src={book.imgLocation} />
                </Carousel.Item> : null}
            </Carousel>
            <div className="d-flex flex-column ms-4 text-start info-text">
                <text>{book.title}</text>
                <text>By {book.author}</text>
                <text>{book.publisher}</text>
                <text>{book.location}</text>
                {book.availability ? <text>Available</text> : <text>Unavailable</text>}
                <text>Copies: {book.copies}</text>
                {getRole() === "student" ? <Stack gap={3} direction="horizontal" className="mt-1 actionBtns">
                    <button onClick={() => { action("Borrow") }}>
                        Borrow
                    </button>
                    <button onClick={() => { action("Request") }}>
                        Request
                    </button>
                </Stack> : <Stack gap={3} direction="horizontal" className="mt-1 actionBtns">
                    <button onClick={() => { action("Edit") }}>
                        Edit
                    </button>
                    <button onClick={() => { action("Delete") }}>
                        Delete
                    </button>
                </Stack>}
            </div>
        </div>
    )
}

export default BookInfo