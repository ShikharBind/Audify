import Navbar from "./Navbar";
import FileUploader from "./FileUploader";
//import { Outlet } from "react-router-dom"

function Home() {

  return (
    <div className="App">
      <Navbar></Navbar>
        <FileUploader/>
    </div>
  );
}

export default Home;