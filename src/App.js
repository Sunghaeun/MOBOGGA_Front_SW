/* eslint-disable */
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import ComingSoon from "./pages/ComingSoon"; // Assuming this is the correct path for the Coming Soon page
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
import UpdateProfile from "./pages/UpdateProfile";

import ManagerMypage from "./pages/Manager/ManagerMypage";
import ManagerUpdateProfile from "./pages/Manager/ManagerUpdateProfile";
import ManagerUpdateClub from "./pages/Manager/ManagerUpdateClub"; // Assuming this is the correct path for the manager update club page
import ManagerHolderList from "./pages/Manager/ManagerHolderList";
import ManagerShowpage from "./pages/Manager/ManagerShowpage";
import ManagerEntertainpage from "./pages/Manager/ManagerEntertainpage";
import ManagerRecruitingpage from "./pages/Manager/ManagerRecruitingpage";

import AddInfo from "./pages/AddInfo";
import Loading from "./pages/Loading";
import OAuthCallback from "./pages/OAuthCallback";
import Error404 from "./pages/Error404";

import CreateRecruiting from "./pages/CreateRecruiting";
import CreateEntertain from "./pages/CreateEntertain";
import CreateShow from "./pages/CreateShow";
import EditRecruiting from "./pages/EditRecruiting";
import EditEntertain from "./pages/EditEntertain";
import EditShow from "./pages/EditShow";
import ManageClubDetail from "./pages/ManageClubDetail";

import KakaoLinkButton from "./components/Mypage/KakaoLinkButton";
import TossAppLauncher from "./components/Mypage/TossAppLauncher";

import FAQ from "./pages/FAQ";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          {/* <Route path="/" element={<Landing />} /> */}
          <Route path="/" element={<ComingSoon />} />
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
          <Route
            path="/manager/mypage/update"
            element={<ManagerUpdateProfile />}
          />
          <Route path="/manager/club/update" element={<ManagerUpdateClub />} />
          <Route
            path="/manager/holder/:scheduleId"
            element={<ManagerHolderList />}
          />
          <Route path="/manager/show" element={<ManagerShowpage />} />
          <Route path="/manager/entertain" element={<ManagerEntertainpage />} />
          <Route
            path="/manager/recruiting"
            element={<ManagerRecruitingpage />}
          />

          <Route path="/add-info" element={<AddInfo />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/login/oauth2/code/google" element={<OAuthCallback />} />
          <Route path="/404" element={<Error404 />} />
          <Route path="/create/recruiting" element={<CreateRecruiting />} />
          <Route path="/create/entertain" element={<CreateEntertain />} />
          <Route path="create/show" element={<CreateShow />} />
          <Route path="/edit/recruiting" element={<EditRecruiting />} />
          <Route path="edit/entertain/:id" element={<EditEntertain />} />
          <Route path="edit/show/:id" element={<EditShow />} />
          <Route path="/manager/club/1" element={<ManageClubDetail />} />
          <Route path="/kakaolinktest" element={<KakaoLinkButton />} />
          <Route path="/tosslinktest" element={<TossAppLauncher />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
