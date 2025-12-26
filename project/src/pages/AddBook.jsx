import { useEffect, useState } from "react"
import { overflow } from "../overflow"
import { useNavigate } from "react-router-dom";
import UploadImage from "../assets/UploadImage.png"
import { addAdminLog } from "../adminLog";
const AddBook = () => {
    const navigate = useNavigate();
    useEffect(() => { overflow(true) }, []);
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
        } else {
            alert("Please upload an image!");
            document.getElementById(fromImg).value = "";
        }
    }
    const addBook = async () => {
        //basic input validation, we admin the admin is smart and there should not be any case-sensitive problems/everything entered should be roughly valid)
        const title = document.getElementById("title").value
        const author = document.getElementById("author").value
        const bookImage = document.getElementById("bookImg").value
        const publisher = document.getElementById("publisher").value
        const isbn = Number(document.getElementById("identifier").value)
        const availability = Boolean(document.getElementById("availability").value)
        const copies = Number(document.getElementById("copies").value)
        const location = document.getElementById("location").value
        const bookLoc = document.getElementById("bookLoc").value
        const level = Number(document.getElementById("level").value)
        if (!title.trim() || !author.trim() || !publisher.trim() || !location.trim() || !bookImage || !isbn || copies === "" || availability === "" || level === "") {
            alert("Cannot proceed! There are empty input values!");
            return;
        } else if (!bookLoc && location !== "Closed Stacks") {
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
        let id;
        try {
            const res = await fetch(`http://localhost:5050/libraryData`);
            if (!res.ok) throw new Error("Failed to get books! Try again later!");
            let data = await res.json();
            const bookIds = data.map(book => book.id);
            id = `B${bookIds.length + 1}`
        } catch (e) {
            alert(e);
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
        jsonData.bookImage = bookImg;
        jsonData.publisher = publisher;
        jsonData.imgLocation = bookLocImg;
        jsonData.level = level;
        try {
            await fetch(`http://localhost:5050/libraryData`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData)
            });
            alert("Book added!");
            navigate("/admin/logs");
            addAdminLog("add", isbn, title);
        } catch (e) {
            alert(e);
            return;
        }
    }
    return (
        <div className="my-1">
            <h4>Add New Book</h4>
            <div className="input">
                <text>Title:</text>
                <br></br>
                <input id="title" type="text" placeholder="Book Name..."></input>
            </div>
            <div className="input">
                <text>Author:</text>
                <br></br>
                <input id="author" type="text" placeholder="Author..."></input>
            </div>
            <div className="input">
                <text>Book Image:</text>
                <br></br>
                <div className="images d-flex flex-column justify-content-center align-items-center">
                    <input onChange={() => { upload("bookImg") }} id="bookImg" type="file" hidden></input>
                    <label className="d-flex flex-column justify-content-center align-items-center" htmlFor="bookImg" type="button">
                        <img src={UploadImage} width={50} />
                        <text className="ms-1" id="bookImgImg">Upload Image</text>
                    </label>
                </div>
            </div>
            <div className="input">
                <text>Publisher:</text>
                <br></br>
                <input id="publisher" type="text" placeholder="Publisher..."></input>
            </div>
            <div className="input">
                <text>Identifier (ISBN):</text>
                <br></br>
                <input id="identifier" type="number" placeholder="ISBN..."></input>
            </div>
            <div className="input">
                <text>Available?</text>
                <br></br>
                <select id="availability">
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
            </div>
            <div className="input">
                <text>Copies:</text>
                <br></br>
                <input id="copies" type="number" placeholder="Copies..."></input>
            </div>
            <div className="input">
                <text>Level</text>
                <br></br>
                <select id="level">
                    <option value={0}>None (Closed Stacks)</option>
                    <option value={6}>Level 6</option>
                    <option value={7}>Level 7</option>
                    <option value={8}>Level 8</option>
                </select>
            </div>
            <div className="input">
                <text>Location:</text>
                <br></br>
                <input id="location" type="text" placeholder="Location..."></input>
            </div>
            <div className="input">
                <text>Book Location:</text>
                <br></br>
                <div className="images d-flex flex-column justify-content-center align-items-center">
                    <input onChange={() => { upload("bookLoc") }} id="bookLoc" type="file" hidden></input>
                    <label className="d-flex flex-column justify-content-center align-items-center" htmlFor="bookLoc" type="button">
                        <img src={UploadImage} width={50} />
                        <text className="ms-1" id="bookLocImg">Upload Image</text>
                    </label>
                </div>
            </div>
            <button id="addBtn" onClick={addBook}>
                Add Book
            </button>
        </div>
    )
}

export default AddBook