import searchIcon from "../assets/Search.png"
import Stack from "react-bootstrap/Stack"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { overflow } from "../overflow"
import NoBooks from "../components/NoBooks";
const StudentHome = () => {
    const [books, setBooks] = useState({})
    const [allBooks, getBooks] = useState([])
    const [noOfBooks, getNumBooks] = useState(0)
    const [searchQuery, setSearchQuery] = useState("");
    const [bookResults, getBookResults] = useState([]);
    const navigate = useNavigate()
    useEffect(() => { overflow(false) }, []);
    useEffect(() => {
        const getViewedBooks = async () => {
            try {
                const res = await fetch(`http://localhost:5050/bookInventory`);
                if (!res.ok) throw new Error("Failed to get books! Try again later!");
                let data = await res.json();
                data = data.filter(u => u.studentId === localStorage.getItem("userId"));
                setBooks(data[0]);
            } catch (e) {
                console.log(e);
            }
        }
        const getAllBooks = async () => {
            try {
                const res = await fetch(`http://localhost:5050/libraryData`);
                if (!res.ok) throw new Error("Failed to get books! Try again later!");
                let data = await res.json();
                getBooks(data);
            } catch (e) {
                console.log(e);
            }
        }
        getViewedBooks();
        getAllBooks();
    }, []);
    useEffect(() => {
        if (!books.booksIds) return;
        const bookCount = books.booksIds.length;
        getNumBooks(bookCount);
    })
    const navToBook = (id) => {
        navigate(`book/${id}`);
    }
    var booksDisplay = 0;
    const viewedBooks = books.booksIds?.map((id) => {
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
    //simplified filter, cant select more than 1, but added closed stacks
    const filterSearch = (filter) => {
        if (filter === "all") {
            getBookResults(allBooks.filter(book => book.title.toLowerCase().includes(searchQuery) || book.author.toLowerCase().includes(searchQuery) || book.publisher.toLowerCase().includes(searchQuery)));
        } else if (filter === "available") {
            getBookResults(allBooks.filter(book => (book.title.toLowerCase().includes(searchQuery) || book.author.toLowerCase().includes(searchQuery) || book.publisher.toLowerCase().includes(searchQuery)) && book.availability));
        } else if (filter === "unavailable") {
            getBookResults(allBooks.filter(book => (book.title.toLowerCase().includes(searchQuery) || book.author.toLowerCase().includes(searchQuery) || book.publisher.toLowerCase().includes(searchQuery)) && !book.availability));
        } else if (filter === "Closed Stacks") {
            getBookResults(allBooks.filter(book => (book.title.toLowerCase().includes(searchQuery) || book.author.toLowerCase().includes(searchQuery) || book.publisher.toLowerCase().includes(searchQuery)) && book.location === filter));
        } else if (typeof filter === "number") {
            getBookResults(allBooks.filter(book => (book.title.toLowerCase().includes(searchQuery) || book.author.toLowerCase().includes(searchQuery) || book.publisher.toLowerCase().includes(searchQuery)) && book.level === filter));
        }
    }
    const searchedBooks = () => {
        const search = document.getElementById("searchBook").value.toLowerCase();
        if (!search) {
            document.querySelector("body").style.overflow = "hidden";
            document.querySelector("html").style.overflow = "hidden";
        } else {
            document.querySelector("body").style.overflow = "auto";
            document.querySelector("html").style.overflow = "auto";
        }
        setSearchQuery(search);
        const results = allBooks.filter(book => book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search) || book.publisher.toLowerCase().includes(search));
        getBookResults(results);
    };
    //search query has been even more simplified
    //it will now just display the closest result based on the book's name + author + publisher upon enter key
    return (
        <Stack className="Stacks">
            <div>
                <label htmlFor="searchBook">
                    <div id="searchBar">
                        <img src={searchIcon} width="30" height="30" />
                        <input placeholder="Search for library books..." id="searchBook" onKeyDown={(e) => { if (e.key === "Enter") searchedBooks() }}></input>
                    </div>
                </label>
            </div >
            <br />
            {!searchQuery ? <><div className="d-flex justify-content-start">
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
                        </Stack></> : <><NoBooks /></>
                }</> : <><div className="d-flex justify-content-start align-items-center">
                    <h3>Search Results:</h3><button className="border-0 ms-auto d-flex align-items-center" id="filterSearch" data-bs-toggle="dropdown"><h3>Filter By:</h3>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="filterSearch">
                        <li><a onClick={() => filterSearch("all")} type="button" className="dropdown-item" id="available">All</a></li>
                        <li><a onClick={() => filterSearch("available")} type="button" className="dropdown-item" id="available">Available</a></li>
                        <li><a onClick={() => filterSearch("unavailable")} type="button" className="dropdown-item" id="available">Unavailable</a></li>
                        <li><a onClick={() => filterSearch("Closed Stacks")} type="button" className="dropdown-item" id="lvl6">Closed Stacks</a></li>
                        <li><a onClick={() => filterSearch(6)} type="button" className="dropdown-item" id="lvl6">Level 6</a></li>
                        <li><a onClick={() => filterSearch(7)} type="button" className="dropdown-item" id="lvl7">Level 7</a></li>
                        <li><a onClick={() => filterSearch(8)} type="button" className="dropdown-item" id="lvl7">Level 8</a></li>
                    </ul>
                </div>
                <br />
                {
                    bookResults.length !== 0 ? (
                        <div className="bookResults">
                            {bookResults.map(book => (
                                <div className="d-flex flex-column justify-content-center align-items-center resultsContainer" type="button" onClick={() => navToBook(book.id)}>
                                    <img className="mb-3 resultsImg" src={book.bookImage} width={120} height={150}></img>
                                    <text>{book.title}</text>
                                    <text>{book.author}</text>
                                    <text>{book.publisher}</text>
                                    {book.availability ? <text className="text-success">Available</text> : <text className="text-danger">Unavailable</text>}
                                </div>
                            ))}
                        </div>
                    ) : <NoBooks />}
            </>}
        </Stack >
    )
}

export default StudentHome