const Others = () => {
    //to trigger scenarios, manually triggering overdue books also due to time constraint
    //get the book based on the id entered
    //note: case sensitive
    const overdue = async () => {
        const bookId = prompt("Enter the book id to be overdued:\n");
        //GET bookInventory
        let userBook = await fetch("http://localhost:5050/bookInventory");
        userBook = await userBook.json();
        userBook = userBook.find(b => (b.studentId === localStorage.getItem("userId")));
        let isBookId = userBook.booksIds.find(id => id == bookId)
        if (isBookId !== undefined) {
            let i = userBook.booksIds.indexOf(bookId);
            if (userBook.status[i] === "Borrowed") {
                userBook.status[i] = "Overdue";
                try {
                    //PATCH bookInventory
                    await fetch(`http://localhost:5050/bookInventory/${userBook.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userBook)
                    })
                    alert("Overdue scenario triggered!");
                    //GET libraryData
                    let getBook = await fetch(`http://localhost:5050/libraryData/${bookId}`);
                    getBook = await getBook.json();
                    let notification = new Object();
                    notification.studentId = localStorage.getItem("userId");
                    notification.message = `Dear Student, the library book, ${getBook.title}, is now officially overdued. Please return the book immediately back to the library to prevent more heavier overdue fees.`
                    notification.messageTime = (new Date()).toISOString();
                    notification.bookId = bookId;
                    //POST notification
                    await fetch(`http://localhost:5050/notification`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(notification)
                    })
                    let adminNoti = new Object();
                    adminNoti.auditTime = (new Date()).toISOString();
                    adminNoti.bookISBN = getBook.identifier
                    adminNoti.bookName = getBook.title
                    adminNoti.actionName = "overdue"
                    adminNoti.readLog = false
                    //GET users
                    let user = await fetch(`http://localhost:5050/users/${localStorage.getItem("userId")}`);
                    user = await user.json();
                    adminNoti.adminNo = user.username;
                    //POST adminLogs
                    await fetch(`http://localhost:5050/adminLogs`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(adminNoti)
                    })
                } catch (e) {
                    console.log(e)
                }
            } else {
                alert("Cannot proceed! Book is not currently in borrowed state!");
                return;
            }
        } else {
            alert("Can't find book id!");
            return;
        }
    }
    const returned = async () => {
        const bookId = prompt("Enter the book id to be returned:\n");
        //GET bookInventory
        let userBook = await fetch("http://localhost:5050/bookInventory");
        userBook = await userBook.json();
        userBook = userBook.find(b => (b.studentId === localStorage.getItem("userId")));
        let isBookId = userBook.booksIds.find(id => id == bookId)
        if (isBookId !== undefined) {
            let i = userBook.booksIds.indexOf(bookId);
            if (userBook.status[i] === "Borrowed" || userBook.status[i] === "Overdue") {
                userBook.status[i] = "Returned";
                userBook.borrowed -= 1;
                userBook.dueDate[i] = "";
                try {
                    //PATCH bookInventory
                    await fetch(`http://localhost:5050/bookInventory/${userBook.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userBook)
                    })
                    alert("Returned scenario triggered!");
                    //GET libraryData
                    let getBook = await fetch(`http://localhost:5050/libraryData/${bookId}`);
                    getBook = await getBook.json();
                    if (!getBook.availability) {
                        getBook.availability = true;
                    }
                    getBook.copies += 1;
                    //PATCH libraryData
                    await fetch(`http://localhost:5050/libraryData/${bookId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(getBook)
                    });
                    let notification = new Object();
                    notification.studentId = localStorage.getItem("userId");
                    notification.message = `Dear Student, the library book, ${getBook.title}, has now been returned!`
                    notification.messageTime = (new Date()).toISOString();
                    notification.bookId = bookId;
                    //POST notification
                    await fetch(`http://localhost:5050/notification`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(notification)
                    })
                    let adminNoti = new Object();
                    adminNoti.auditTime = (new Date()).toISOString();
                    adminNoti.bookISBN = getBook.identifier
                    adminNoti.bookName = getBook.title
                    adminNoti.actionName = "returned"
                    adminNoti.readLog = false
                    //POST adminLogs
                    await fetch(`http://localhost:5050/adminLogs`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(adminNoti)
                    })

                } catch (e) {
                    console.log(e)
                }
            } else {
                alert("Cannot proceed! You currently do not have this book in your possession!");
                return;
            }
        } else {
            alert("Can't find book id!");
            return;
        }
    }
    return (
        <div className="otherContainer">
            <button onClick={() => overdue()}>Overdue Book</button>
            <span className="mt-2 mb-2"></span>
            <button onClick={() => returned()}>Return Book</button>
        </div>
    )
}

export default Others
