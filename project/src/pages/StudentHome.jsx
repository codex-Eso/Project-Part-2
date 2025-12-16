import searchIcon from "../assets/Search.png"
const StudentHome = () => {
    return (
        <div>
            <label for="searchBook">
                <div id="searchBar">
                    <img src={searchIcon} width="30" height="30" />
                    <input placeholder="Search for library books..." id="searchBook"></input>
                </div>
            </label>
        </div>
    )
}

export default StudentHome