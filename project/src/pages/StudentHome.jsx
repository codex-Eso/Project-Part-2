import searchIcon from "../assets/Search.png"
import Stack from "react-bootstrap/Stack"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const StudentHome = () => {
    const [books, setBooks] = useState({})
    const [allBooks, getBooks] = useState([])
    const [noOfBooks, getNumBooks] = useState(0)
    const navigate = useNavigate()
    useEffect(() => {
        const getViewedBooks = async () => {
            try {
                const res = await fetch(`http://localhost:5050/bookInventory`);
                if (!res.ok) throw new Error("Failed to get books! Try again later!");
                let data = await res.json();
                data = data.filter(u => u.studentId === localStorage.getItem("userId"));
                setBooks(data[0]);
            } catch (e) {
                if (e === "Failed to get books! Try again later!") alert(e);
            }
        }
        const getAllBooks = async () => {
            try {
                const res = await fetch(`http://localhost:5050/libraryData`);
                if (!res.ok) throw new Error("Failed to get books! Try again later!");
                let data = await res.json();
                getBooks(data);
            } catch (e) {
                if (e === "Failed to get books! Try again later!") alert(e);
            }
        }
        getViewedBooks();
        getAllBooks();
    });
    useEffect(() => {
        if (!books.booksIds) return;
        const bookCount = books.booksIds.length;
        getNumBooks(bookCount);
    })
    const navToBook = (id) => {
        navigate(`book/${id}`);
    }
    var booksDisplay = 0;
    const viewedBooks = books.booksIds?.map((id, i) => {
        if (booksDisplay === 3) return null;
        const matchedBooks = allBooks.find(book => book.id === id);
        if (!matchedBooks) return null;
        booksDisplay++;
        return (
            <div id="bookInfo" onClick={() => navToBook(matchedBooks.id)} className="ViewedBox" key={id}>
                <img src={matchedBooks.bookImage} />
                <div className="d-flex flex-column text-start fs-5 ps-3 viewBookText">
                    <text>{matchedBooks.title}</text>
                    <text>By {matchedBooks.author}</text>
                    {matchedBooks.availability && <text className="text-success">Available</text>}
                    {!matchedBooks.availability && <text className="text-danger">Unavailable</text>}
                </div>
            </div>
        );
    });
    return (
        <Stack className="Stacks">
            <div>
                <label htmlFor="searchBook">
                    <div id="searchBar">
                        <img src={searchIcon} width="30" height="30" />
                        <input placeholder="Search for library books..." id="searchBook"></input>
                    </div>
                </label>
            </div>
            <br />
            <div className="d-flex justify-content-start">
                <h3>Your Collection:</h3>
            </div>
            <br />
            {
                booksDisplay !== 0 ? <><div className="d-flex align-items-center mb-2">
                    <h4>Recently Viewed:</h4>
                    {noOfBooks > 3 && <h4 onClick={() => { navigate("inventory") }} className="text-decoration-underline ms-auto viewAll">View All</h4>}
                </div>
                    <Stack className="viewBooks" direction="horizontal">
                        {!viewedBooks && <div className="d-flex justify-content-center align-items-center w-100 mt-3 gap-3" direction="horizontal"><div className="spinner-grow"></div><div className="spinner-grow"></div><div className="spinner-grow"></div></div>}
                        {viewedBooks}
                    </Stack></> : <>Oops no books :((</> //editing this later
            }
        </Stack>
    )
}

export default StudentHome