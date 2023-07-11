import Navbar from "./Navbar";
import FileUploader from "./FileUploader";
import URLConverter from "./URLconverter";
//import { Outlet } from "react-router-dom"

function Home() {

  return (
    <div className="App">
      <Navbar></Navbar>
        <FileUploader/>
        <URLConverter/>
    </div>
  );
}

export default Home;