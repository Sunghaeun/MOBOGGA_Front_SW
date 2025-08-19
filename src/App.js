/* eslint-disable */
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ServerDownModal from "./components/modal/ServerDownModal";

import {
  ServerStatusProvider,
  useServerStatus,
} from "./contexts/ServerStatusContext";
import useAuthStore from "./stores/authStore";
import useIsMobile from "./hooks/useIsMobile";

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

// 메인 앱 컴포넌트 (ServerStatusProvider 내부)
function AppContent() {
  const { isServerDown, retryConnection, closeModal, handleServerError } =
    useServerStatus();
  const { initialize } = useAuthStore();
  const isMobile = useIsMobile();

  // Zustand 스토어 초기화
  useEffect(() => {
    console.log("🚀 앱 시작 - Zustand 스토어 초기화");
    initialize();
  }, [initialize]);

  // 모바일 접속 시 ComingSoon 페이지 표시
  if (isMobile) {
    console.log("📱 모바일 접속 감지 - ComingSoon 페이지 표시");
    return (
      <BrowserRouter>
        <div className="App">
          <ComingSoon />
        </div>
      </BrowserRouter>
    );
  }

  const handleRetry = async () => {
    const success = await retryConnection();
    if (success) {
      // 연결 성공 시 현재 페이지 새로고침
      window.location.reload();
    }
  };

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

          <Route path="/recruiting/create" element={<CreateRecruiting />} />
          <Route path="/show/create" element={<CreateShow />} />
          <Route path="/entertain/create" element={<CreateEntertain />} />

          <Route
            path="/edit/recruiting/:recruitingId"
            element={<EditRecruiting />}
          />
          <Route path="edit/entertain/:id" element={<EditEntertain />} />
          <Route path="edit/show/:id" element={<EditShow />} />
          <Route path="/manager/club/:id" element={<ManageClubDetail />} />
          <Route path="/kakaolinktest" element={<KakaoLinkButton />} />
          <Route path="/tosslinktest" element={<TossAppLauncher />} />
        </Routes>
        <Footer />

        {/* 서버 다운 모달 */}
        <ServerDownModal
          isOpen={isServerDown}
          onRetry={handleRetry}
          onClose={closeModal}
        />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ServerStatusProvider>
      <AppContent />
    </ServerStatusProvider>
  );
}

export default App;
