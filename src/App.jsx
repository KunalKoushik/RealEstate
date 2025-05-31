import { DarkModeProvider } from "./components/DarkModeContext";
import { useSyncExternalStore } from "react";
import { jwtDecode } from "jwt-decode";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import CreateAccount from "./pages/CreateAccount";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import VerifyOtp from "./components/Auth/VerifyOtp";
import Property from "./pages/Property";
// import FilterPage from "./components/property/FilterPage";
import FilterContent from "./components/property/FilterContent";
import PropertyDetail from "./components/Profile/PropertyDetail";
import EditProfile from "./components/Profile/EditProfile";
import Favorites from "./components/Profile/Favorites";
import Admin from "../Admin-Panel/Admin";

function App() {
  let email = "";

  // Extract token from local storage when the component mounts

  const subscribe = (callback) => {
    const intervalId = setInterval(callback, 500); // Check every 500ms (adjust as needed)
    return () => clearInterval(intervalId);
  };
  // const getSnapshot = () => Cookies.get("cookie");
  const getSnapshot = () => localStorage.getItem("token"); // Get token from local storage
  const userToken = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  if (userToken) {
    try {
      const decodedToken = jwtDecode(userToken); // Decode JWT
      // console.log("decoded:", decodedToken);
      email = decodedToken.email; // Assuming the token has a "email" field
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  return (
    <Router>
      <DarkModeProvider>
        <Header />

        <Routes>
          <Route
            path="/account"
            element={userToken ? <Profile /> : <CreateAccount />}
          />
          <Route path="/" element={<Home />} />
          <Route path="/filter" element={<FilterContent />} />
          <Route path="/properties" element={<Property />} />
          <Route path="/verifyotp" element={<VerifyOtp />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
        <Footer />
      </DarkModeProvider>
    </Router>
  );
}

export default App;
