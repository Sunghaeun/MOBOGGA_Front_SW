import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";

import Footer from "./components/Footer";
import Main from "./pages/Main";

import Landing from "./pages/Landing";
import ShowDetail from "./pages/ShowDetail";

import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Clubs from "./pages/Clubs";
import Recruiting from "./pages/Recruiting";
import RecruitingDetail from "./pages/RecruitingDetail";
import AddInfo from "./pages/AddInfo";
import Mypage from "./pages/Mypage";
import ManagerMypage from "./pages/Manager/ManagerMypage";
import UpdateProfile from "./pages/UpdateProfile";
import ClubDetail from "./pages/ClubDetail";
import Loading from "./pages/Loading";
import EntertainDetail from "./pages/EntertainDetail";
import CreateShow from "./pages/Manager/CreateShow";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/main" element={<Main />} />
          <Route path="/show/:showId" element={<ShowDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/Recruiting" element={<Recruiting />} />
          <Route
            path="/recruiting/:recruitingId"
            element={<RecruitingDetail />}
          />
          <Route path="/add-info" element={<AddInfo />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/mypage/update" element={<UpdateProfile />} />
          <Route path="/manager/mypage" element={<ManagerMypage />} />
          <Route path="/manager/mypage/update" element={<UpdateProfile />} />
          <Route path="/clubs/:id" element={<ClubDetail />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/entertain/:id" element={<EntertainDetail />} />
          <Route path="/manager/createshow" element={<CreateShow />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
