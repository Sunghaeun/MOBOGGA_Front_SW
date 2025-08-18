import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/ManagerMypage.module.css";
import loadingStyles from "../../styles/Loading.module.css";
import useAuthStore from "../../stores/authStore";
import apiClient from "../../utils/apiClient";
import AccountInfoCard from "../../components/Mypage/AccountInfoCard";
import ManagerProfileInfoCard from "../../components/Mypage/ManagerProfileInfoCard";
import ManagerProfileUpdateBtn from "../../components/Mypage/ManagerProfileUpdateBtn";
import ClubUpdateBtn from "../../components/Manager/ClubUpdateBtn";
import ReservManageCard from "../../components/Manager/ReservManageCard";
import LoginOverModal from "../../components/Mypage/LoginOverModal";
import ServerErrorModal from "../../components/Mypage/ServerErrorModal";

function ManagerMypage() {
  const navigate = useNavigate();
  const {
    user,
    isLoggedIn,
    isLoading: authLoading,
    isManager,
  } = useAuthStore();

  // 매니저 권한 여부를 변수로 저장
  const isManagerUser = isManager();

  // 초기 권한 체크
  useEffect(() => {
    console.log("=== MANAGER MYPAGE INIT ===");
    console.log("Auth loading:", authLoading);
    console.log("Is logged in:", isLoggedIn);
    console.log("User:", user);
    console.log("Is manager:", isManagerUser);

    // 로딩 중이면 기다림
    if (authLoading) {
      console.log("인증 정보 로딩 중... 기다림");
      return;
    }

    if (!isLoggedIn || !isManagerUser) {
      console.log("권한 없음 - 로그인 페이지로 리다이렉트");
      console.log("isLoggedIn:", isLoggedIn, "isManagerUser:", isManagerUser);
      navigate("/login", { replace: true });
      return;
    }

    console.log("권한 확인 완료 - 데이터 조회 시작");
    fetchManagerProfile();
    // fetchClubInfo();
    // fetchReservationManage();
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

  const handleServerErrorModalClose = () => {
    setIsServerErrorModalOpen(false);
    setError("");
  };

  const [reservManageCards, setReservManageCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchManagerProfile = useCallback(async () => {
    try {
      console.log("=== FETCH MANAGER PROFILE START ===");
      console.log("현재 토큰 상태:", !!useAuthStore.getState().token);
      console.log("현재 사용자 정보:", useAuthStore.getState().user);

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
      console.log("에러 상세:", {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });

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
  }, []);

  const getReservManageCards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("=== FETCH RESERVATION CARDS START ===");
      console.log("현재 토큰 상태:", !!useAuthStore.getState().token);
      console.log("현재 사용자 정보:", useAuthStore.getState().user);

      const response = await apiClient.get("/mypage/manager/holder/list");
      console.log("Reservation cards response:", response.data);

      const data = response.data;
      console.log("=== RAW RESERVATION DATA ===");
      console.log("Full response data:", data);
      console.log("Data keys:", Object.keys(data));
      console.log("Has reservationList:", "reservationList" in data);
      console.log("reservationList value:", data.reservationList);

      if (!data || !data.reservationList) {
        console.log("Data structure issue - trying alternative keys");
        console.log("Available keys:", Object.keys(data || {}));
        throw new Error("공연 내역 데이터 형식이 올바르지 않습니다.");
      }

      setReservManageCards(data.reservationList || []);
      console.log("공연 내역 데이터:", data.reservationList);
    } catch (err) {
      console.error("에러 발생:", err);
      console.log("에러 상세:", {
        status: err.response?.status,
        message: err.message,
        data: err.response?.data,
      });

      if (
        err.code === "ECONNABORTED" ||
        err.name === "TypeError" ||
        (err.message && err.message.includes("fetch"))
      ) {
        setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
        setIsServerErrorModalOpen(true);
      } else {
        setError(err.message || "공연 내역을 불러오는데 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 사용자 정보 조회
  useEffect(() => {
    if (!authLoading && isLoggedIn && isManagerUser) {
      fetchManagerProfile();
      getReservManageCards();
    }
  }, [
    authLoading,
    isLoggedIn,
    isManagerUser,
    fetchManagerProfile,
    getReservManageCards,
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
                id={styles.highlight}
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
              >
                행사
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
                  매니저 정보를 불러오고 있습니다
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
              id={styles.highlight}
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
            >
              행사
            </div>
            <div
              className={styles.category_list}
              onClick={() => navigate("/manager/recruiting")}
            >
              리크루팅
            </div>
          </div>
          <div className={styles.content_list}>
            <div className={styles.content}>
              {isLoading && (
                <div className={loadingStyles.loading}>
                  <div className={loadingStyles.loadingSpinner}></div>
                  <div className={loadingStyles.loadingText}>
                    예매자 목록을 불러오고 있습니다
                    <span className={loadingStyles.loadingDots}>...</span>
                  </div>
                  <div className={loadingStyles.loadingSubtext}>
                    잠시만 기다려주세요
                  </div>
                </div>
              )}
              {error && !isLoginOverModalOpen && (
                <div className={styles.error_message}>
                  <div className={styles.errorIcon}>⚠️</div>
                  <div className={styles.errorMessage}>{error}</div>
                  <button
                    onClick={() => {
                      setError(null);
                      fetchManagerProfile();
                      getReservManageCards();
                    }}
                    className={styles.retry_button}
                  >
                    🔄 다시 시도
                  </button>
                </div>
              )}
              {!isLoading && !error && reservManageCards.length === 0 && (
                <div className={styles.no_show}>공연 내역이 없습니다.</div>
              )}
              {!isLoading &&
                !error &&
                reservManageCards.length > 0 &&
                reservManageCards.map((reservManageCard) => (
                  <div
                    key={reservManageCard.scheduleId * Math.random()}
                    className="reserv_manage_card"
                  >
                    <ReservManageCard data={reservManageCard} />
                  </div>
                ))}
            </div>
          </div>
        </div>
        {isLoginOverModalOpen && (
          <LoginOverModal
            isOpen={isLoginOverModalOpen}
            onClose={() => setIsLoginOverModalOpen(false)}
          />
        )}
        {isServerErrorModalOpen && (
          <ServerErrorModal
            isOpen={isServerErrorModalOpen}
            onClose={handleServerErrorModalClose}
          />
        )}
      </div>
    </>
  );
}

export default ManagerMypage;
