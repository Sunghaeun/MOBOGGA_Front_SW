/*eslint-disable*/
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/ManagerEntertainpage.module.css";
import loadingStyles from "../../styles/Loading.module.css";
import AccountInfoCard from "../../components/Mypage/AccountInfoCard";
import ManagerProfileInfoCard from "../../components/Mypage/ManagerProfileInfoCard";
import ManagerProfileUpdateBtn from "../../components/Mypage/ManagerProfileUpdateBtn";
import ClubUpdateBtn from "../../components/Manager/ClubUpdateBtn";
import EntertainCard from "../../components/Manager/EntertainCard";
import LoginOverModal from "../../components/Mypage/LoginOverModal";
import ServerErrorModal from "../../components/Mypage/ServerErrorModal";
import useAuthStore from "../../stores/authStore";
import apiClient from "../../utils/apiClient";

function ManagerEntertainpage() {
  const navigate = useNavigate();
  const {
    user,
    isLoggedIn,
    isLoading: authLoading,
    isManager,
    token,
  } = useAuthStore();

  // 매니저 권한 여부를 변수로 저장
  const isManagerUser = isManager();
  const userRole = user?.authority;

  // 초기 권한 체크
  useEffect(() => {
    console.log("=== MANAGER ENTERTAIN PAGE INIT ===");
    console.log("Auth loading:", authLoading);
    console.log("로그인 상태:", isLoggedIn);
    console.log("매니저 권한:", isManagerUser);
    console.log("사용자 역할:", userRole);

    // 로딩 중이면 기다림
    if (authLoading) {
      console.log("인증 정보 로딩 중... 기다림");
      return;
    }

    if (!isLoggedIn || !isManagerUser) {
      console.log("권한 없음 - 로그인 페이지로 리다이렉트");
      navigate("/login", { replace: true });
      return;
    }

    console.log("권한 확인 완료");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isManagerUser, authLoading, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    clubName: "",
    phoneNum: "",
    email: "",
    clubPoster: "",
  });

  const [isLoginOverModalOpen, setIsLoginOverModalOpen] = useState(false);
  const [isServerErrorModalOpen, setIsServerErrorModalOpen] = useState(false);
  const [entertainCards, setEntertainCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleServerErrorModalClose = () => {
    setIsServerErrorModalOpen(false);
    setError("");
  };

  const fetchManagerProfile = useCallback(async () => {
    try {
      console.log("=== FETCH MANAGER PROFILE START ===");
      console.log("현재 토큰 상태:", !!token);
      console.log("현재 사용자 정보:", user);

      const response = await apiClient.get("/mypage/manager/profile");
      console.log("Manager profile response:", response.data);

      const managerData = response.data;

      // 서버에서 받은 데이터를 폼 데이터 형식에 맞게 변환
      setFormData({
        clubName: managerData.clubName || "",
        name: managerData.name || "",
        phoneNum: managerData.phoneNumber || "",
        email: managerData.email || "",
        clubPoster: managerData.clubPoster || "",
      });
    } catch (error) {
      console.error("Manager profile fetch error:", error);
      if (
        error.code === "ECONNABORTED" ||
        error.name === "TypeError" ||
        (error.message && error.message.includes("fetch"))
      ) {
        setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
        setIsServerErrorModalOpen(true);
      } else {
        setError(error.message || "사용자 정보를 불러오는데 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  const getEntertainCards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("=== FETCH ENTERTAIN CARDS START ===");
      console.log("현재 토큰 상태:", !!token);
      console.log("현재 사용자 정보:", user);

      const response = await apiClient.get("/mypage/manager/entertain");
      console.log("Entertain cards response:", response.data);

      const data = response.data;
      console.log("Entertain 전체 응답 데이터:", data);

      // API 응답에서 entertainList 추출
      if (!data || !data.entertainList) {
        console.log("entertainList가 없습니다. 전체 응답:", data);
        setEntertainCards([]);
        return;
      }

      setEntertainCards(data.entertainList || []);
      console.log("설정된 즐길거리 내역 데이터:", data.entertainList);
    } catch (err) {
      console.error("즐길거리 카드 조회 에러:", err);
      if (
        err.code === "ECONNABORTED" ||
        err.name === "TypeError" ||
        (err.message && err.message.includes("fetch"))
      ) {
        setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
        setIsServerErrorModalOpen(true);
      } else {
        setError(err.message || "즐길거리 목록을 불러오는데 실패했습니다.");
      }
      setEntertainCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  // 사용자 정보 조회
  useEffect(() => {
    const fetchData = async () => {
      if (!authLoading && isLoggedIn && isManagerUser) {
        await fetchManagerProfile();
        await getEntertainCards();
      }
    };

    fetchData();
  }, [
    authLoading,
    isLoggedIn,
    isManagerUser,
    fetchManagerProfile,
    getEntertainCards,
  ]);

  const handleManagerProfileUpdate = () => {
    navigate("/manager/mypage/update", { replace: false });
  };

  const handleClubUpdate = () => {
    navigate("/manager/club/update", { replace: false });
  };

  if (isLoading) {
    console.log("로딩 중 화면 렌더링");
    return (
      <>
        <div className={styles.body}>
          <div className={styles.sidebar}>
            <AccountInfoCard formData={formData} />
            <ManagerProfileInfoCard formData={formData} />
            <ManagerProfileUpdateBtn onClick={handleManagerProfileUpdate} />
            <ClubUpdateBtn onClick={handleClubUpdate} />
          </div>
          <div className={styles.container}>
            <div className={styles.category_box}>
              <div
                className={styles.category_list}
                onClick={() => navigate("/manager/mypage")}
              >
                예매자 목록
              </div>
              <div
                className={styles.category_list}
                onClick={() => navigate("/manager/show")}
              >
                공연
              </div>
              <div
                className={styles.category_list}
                onClick={() => navigate("/manager/entertain")}
                id={styles.highlight}
              >
                즐길거리
              </div>
              <div
                className={styles.category_list}
                onClick={() => navigate("/manager/recruiting")}
              >
                리크루팅
              </div>
            </div>
            <div className={styles.content_list}>
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <div className={styles.loadingText}>
                  즐길거리 목록을 불러오고 있습니다
                  <span className={styles.loadingDots}>...</span>
                </div>
                <div className={styles.loadingSubtext}>잠시만 기다려주세요</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <AccountInfoCard formData={formData} />
          <ManagerProfileInfoCard formData={formData} />
          <ManagerProfileUpdateBtn onClick={handleManagerProfileUpdate} />
          <ClubUpdateBtn onClick={handleClubUpdate} />
        </div>
        <div className={styles.container}>
          <div className={styles.category_box}>
            <div
              className={styles.category_list}
              onClick={() => navigate("/manager/mypage")}
            >
              예매자 목록
            </div>
            <div
              className={styles.category_list}
              onClick={() => navigate("/manager/show")}
            >
              공연
            </div>
            <div
              className={styles.category_list}
              onClick={() => navigate("/manager/entertain")}
              id={styles.highlight}
            >
              즐길거리
            </div>
            <div
              className={styles.category_list}
              onClick={() => navigate("/manager/recruiting")}
            >
              리크루팅
            </div>
          </div>
          <div className={styles.content_list}>
            {entertainCards && entertainCards.length > 0 ? (
              <div className={styles.content_list}>
                {entertainCards.map((card, index) => (
                  <EntertainCard key={index} data={card} />
                ))}
              </div>
            ) : (
              <div className={styles.empty_state}>
                <div className={styles.empty_message}>
                  등록된 즐길거리가 없습니다.
                </div>
                <div className={styles.empty_submessage}>
                  새로운 즐길거리를 등록해보세요.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모달들 */}
      {isLoginOverModalOpen && (
        <LoginOverModal
          onClose={() => setIsLoginOverModalOpen(false)}
          message={error || "로그인이 필요합니다."}
        />
      )}
      {isServerErrorModalOpen && (
        <ServerErrorModal
          onClose={handleServerErrorModalClose}
          message={error || "서버 오류가 발생했습니다."}
        />
      )}
    </>
  );
}

export default ManagerEntertainpage;
