import "./App.css";
import FooterComponent from "./components/FooterComponent";
import HeaderComponent from "./components/HeaderComponent";
import ContactsListComponent from "./components/ContactsListComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ContactsDetail from "./components/ContactsDetailComponent";

function App() {
  return (
    <Router>
      <HeaderComponent />
      <div className="container">
        <Routes>
          <Route exact path="/" element={<ContactsListComponent />} />
          <Route path="/contacts" element={<ContactsListComponent />} />
          <Route path="/add-contact" element={<ContactsDetail />} />
          <Route path="/contacts/:id" element={<ContactsDetail />} />
        </Routes>
      </div>
      <FooterComponent />
    </Router>
  );
}

export default App;
