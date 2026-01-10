import { useParams } from "react-router"
import { useNavigate } from "react-router-dom";
import { overflow } from "../overflow"
import { useEffect, useState } from "react";
import UploadImage from "../assets/UploadImage.png"
import { addAdminLog } from "../adminLog";

const EditBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, bookInfo] = useState({});
    useEffect(() => { overflow(true) }, []);
    useEffect(() => { }, [id]);
    useEffect(() => {
        const getBookInfo = async () => {
            try {
                //GET libraryData
                const res = await fetch(`http://localhost:5050/libraryData/${id}`);
                if (!res.ok) throw new Error("Failed to get book! Try again later!");
                let data = await res.json();
                bookInfo(data);
            } catch (e) {
                navigate("error");
            }
        }
        getBookInfo()
    }, [])
    const [bookImg, setBookImg] = useState("");
    const [bookLocImg, setBookLocImg] = useState("");
    const upload = (fromImg) => {
        const file = document.getElementById(fromImg).files[0];
        if (file.type.startsWith('image/')) {
            document.getElementById(`${fromImg}Img`).innerHTML = `${file.name}`
            const reader = new FileReader();
            reader.onloadend = () => {
                if (fromImg === "bookImg") {
                    setBookImg(reader.result)
                } else if (fromImg === "bookLoc") {
                    setBookLocImg(reader.result)
                }
            }
            reader.readAsDataURL(file);
            document.querySelectorAll(".images img").src = UploadImage
        } else {
            alert("Please upload an image!");
            document.getElementById(fromImg).value = "";
        }
    }
    const editBook = async () => {
        const title = document.getElementById("title").value
        const author = document.getElementById("author").value
        const bookImage = document.getElementById("bookImg").value
        const publisher = document.getElementById("publisher").value
        const isbn = Number(document.getElementById("identifier").value)
        const availability = document.getElementById("availability").value === true;
        const copies = Number(document.getElementById("copies").value)
        const location = document.getElementById("location").value
        const bookLoc = document.getElementById("bookLoc").value
        const level = Number(document.getElementById("level").value)
        if (!title.trim() || !author.trim() || !publisher.trim() || !location.trim() || !isbn || copies === "" || availability === "" || level === "") {
            alert("Cannot proceed! There are empty input values!");
            return;
        } else if (copies < 0 || isbn < 0) {
            alert("Cannot proceed! ISBN & Copies must be appropriate numeric values!");
            return;
        } else if (isbn.toString().length < 10) {
            alert("Cannot proceed! ISBN has to be an unique number with ten or more characters!");
            return;
        } else if (location === "Closed Stacks" && level != 0) {
            alert("Cannot proceed! Location & Level must match appropriately!");
            return;
        } else if (location !== "Closed Stacks" && level == 0) {
            alert("Cannot proceed! Location & Level must match appropriately!");
            return;
        }
        let jsonData = new Object();
        jsonData.id = id;
        jsonData.location = location;
        jsonData.availability = availability;
        jsonData.identifier = isbn;
        jsonData.copies = copies;
        jsonData.title = title;
        jsonData.author = author;
        if (bookImage) {
            jsonData.bookImage = bookImg;
        }
        jsonData.publisher = publisher;
        if (bookLoc) {
            jsonData.imgLocation = bookLocImg;
        }
        jsonData.level = level;
        try {
            //PATCH libraryData
            await fetch(`http://localhost:5050/libraryData/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData)
            });
            alert("Book edited!");
            navigate("/admin/logs");
            addAdminLog("edit", isbn, title);
        } catch (e) {
            console.log(e);
            return;
        }
    }
    return (
        <div className="my-1">
            <h4>Edit Book</h4>
            <div className="input">
                <text>Title:</text>
                <br></br>
                <input id="title" type="text" placeholder="Book Name..." defaultValue={book.title}></input>
            </div>
            <div className="input">
                <text>Author:</text>
                <br></br>
                <input id="author" type="text" placeholder="Author..." defaultValue={book.author}></input>
            </div>
            <div className="input">
                <text>Book Image:</text>
                <br></br>
                <div className="images d-flex flex-column justify-content-center align-items-center">
                    <input onChange={() => { upload("bookImg") }} id="bookImg" type="file" hidden></input>
                    <label className="d-flex flex-column justify-content-center align-items-center" htmlFor="bookImg" type="button">
                        <img src={book.bookImage || UploadImage} width={50} />
                        <text className="ms-1" id="bookImgImg">Upload New Image</text>
                    </label>
                </div>
            </div>
            <div className="input">
                <text>Publisher:</text>
                <br></br>
                <input id="publisher" type="text" placeholder="Publisher..." defaultValue={book.publisher}></input>
            </div>
            <div className="input">
                <text>Identifier (ISBN):</text>
                <br></br>
                <input id="identifier" type="number" placeholder="ISBN..." defaultValue={book.identifier}></input>
            </div>
            <div className="input">
                <text>Available?</text>
                <br></br>
                {book.availability !== undefined && (
                    <select id="availability" defaultValue={book.availability ? "true" : "false"}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                )}
            </div>
            <div className="input">
                <text>Copies:</text>
                <br></br>
                <input id="copies" type="number" placeholder="Copies..." defaultValue={book.copies}></input>
            </div>
            <div className="input">
                <text>Level</text>
                <br></br>
                {book.level !== undefined && (
                    <select id="level" defaultValue={String(book.level)}>
                        <option value="0">None (Closed Stacks)</option>
                        <option value="6">Level 6</option>
                        <option value="7">Level 7</option>
                        <option value="8">Level 8</option>
                    </select>
                )}
            </div>
            <div className="input">
                <text>Location:</text>
                <br></br>
                <input id="location" type="text" placeholder="Location..." defaultValue={book.location}></input>
            </div>
            <div className="input">
                <text>Book Location:</text>
                <br></br>
                <div className="images d-flex flex-column justify-content-center align-items-center">
                    <input onChange={() => { upload("bookLoc") }} id="bookLoc" type="file" hidden></input>
                    <label className="d-flex flex-column justify-content-center align-items-center" htmlFor="bookLoc" type="button">
                        <img src={book.imgLocation || UploadImage} width={50} />
                        <text className="ms-1" id="bookLocImg">Upload New Image</text>
                    </label>
                </div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <button id="addBtn" onClick={editBook}>
                    Edit Book
                </button>
                <text className="mt-2 mb-1" style={{ fontWeight: "500", textDecoration: "underline", fontSize: 18, cursor: "pointer" }} onClick={() => navigate(-1)}>Back</text>
            </div>

        </div>
    )
}

export default EditBook