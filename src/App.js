import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import Main from "./pages/Main";

import ShowDetail from "./pages/ShowDetail";
import EntertainDetail from "./pages/EntertainDetail";

import Login from "./pages/Login";
import Logout from "./pages/Logout";

import Clubs from "./pages/Clubs";
import ClubDetail from "./pages/ClubDetail";

import Recruiting from "./pages/Recruiting";
import RecruitingDetail from "./pages/RecruitingDetail";

import Mypage from "./pages/Mypage";
import ManagerMypage from "./pages/Manager/ManagerMypage";
import UpdateProfile from "./pages/UpdateProfile";

import AddInfo from "./pages/AddInfo";
import Loading from "./pages/Loading";
import Error404 from "./pages/Error404";

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
          <Route path="/entertain/:id" element={<EntertainDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="/clubs" element={<Clubs />} />
          <Route path="/clubs/:id" element={<ClubDetail />} />

          <Route path="/recruiting" element={<Recruiting />} />
          <Route
            path="/recruiting/:recruitingId"
            element={<RecruitingDetail />}
          />

          <Route path="/mypage" element={<Mypage />} />
          <Route path="/mypage/update" element={<UpdateProfile />} />

          <Route path="/manager/mypage" element={<ManagerMypage />} />
          <Route path="/manager/mypage/update" element={<UpdateProfile />} />

          <Route path="/add-info" element={<AddInfo />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/404" element={<Error404 />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
