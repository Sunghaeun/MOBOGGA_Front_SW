/*eslint-disable*/
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Mypage.module.css";
import loadingStyles from "../styles/Loading.module.css";
import useAuthStore from "../stores/authStore";
import apiClient from "../utils/apiClient";
import reload_btn from "../assets/temp/reload_btn.png";
import AccountInfoCard from "../components/Mypage/AccountInfoCard";
import ProfileInfoCard from "../components/Mypage/ProfileInfoCard";
import ProfileUpdateBtn from "../components/Mypage/ProfileUpdateBtn";
import MyReservCard from "../components/Mypage/MyReservCard";
import LoginOverModal from "../components/Mypage/LoginOverModal";
import ServerErrorModal from "../components/Mypage/ServerErrorModal";

function Mypage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading: authLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    phoneNumber: "",
    email: "",
  });

  const [isLoginOverModalOpen, setIsLoginOverModalOpen] = useState(false);
  const [isServerErrorModalOpen, setIsServerErrorModalOpen] = useState(false);

  const handleServerErrorModalClose = () => {
    setIsServerErrorModalOpen(false);
    setError("");
  };

  const [myReservCards, setMyReservCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  // 초기 권한 체크
  useEffect(() => {
    // 초기 권한 체크
    // 로딩 중이면 기다림
    if (authLoading) return;

    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }
    fetchUserProfile();
    fetchMyReservations();
  }, [isLoggedIn, authLoading, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get("/mypage/student/profile");
      // response received

      const userData = response.data;

      // 서버에서 받은 데이터를 폼 데이터 형식에 맞게 변환
      setFormData({
        name: userData.name || "",
        studentId: userData.studentId || "",
        phoneNumber: userData.phoneNumber || "",
        email: userData.email || "",
      });
    } catch (error) {
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
  };

  const fetchMyReservations = async () => {
    try {
      const response = await apiClient.get("/mypage/student/myreservation");
      // response received

      setMyReservCards(response.data || []);
    } catch (error) {
      if (
        error.code === "ECONNABORTED" ||
        error.name === "TypeError" ||
        (error.message && error.message.includes("fetch"))
      ) {
        setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
        setIsServerErrorModalOpen(true);
      } else {
        setError(error.message || "예약 정보를 불러오는데 실패했습니다.");
      }
    }
  };

  const reloadMyReservCards = () => {
    fetchMyReservations();
  };

  if (!isLoggedIn && !authLoading) {
    return (
      <LoginOverModal
        isOpen={true}
        onClose={() => {
          navigate("/login");
        }}
      />
    );
  }

  if (isMobile) {
    return (
      <div className={styles.mobile_body}>
        <header className={styles.mobile_header}>
          <button className={styles.back_btn} onClick={() => navigate(-1)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="20"
              viewBox="0 0 12 20"
              fill="none"
            >
              <path
                d="M9.18206 19.6042L0.290237 10.7388C0.184697 10.6332 0.110114 10.5189 0.0664908 10.3958C0.0221636 10.2726 0 10.1407 0 10C0 9.85928 0.0221636 9.72735 0.0664908 9.60422C0.110114 9.48109 0.184697 9.36675 0.290237 9.26121L9.18206 0.369393C9.42832 0.123131 9.73615 0 10.1055 0C10.4749 0 10.7916 0.131926 11.0554 0.395778C11.3193 0.659631 11.4512 0.967458 11.4512 1.31926C11.4512 1.67106 11.3193 1.97889 11.0554 2.24274L3.29815 10L11.0554 17.7573C11.3017 18.0035 11.4248 18.3068 11.4248 18.667C11.4248 19.028 11.2929 19.3404 11.029 19.6042C10.7652 19.8681 10.4573 20 10.1055 20C9.75374 20 9.44591 19.8681 9.18206 19.6042Z"
                fill="#121212"
              />
            </svg>
          </button>
          <span className={styles.header_title}>마이페이지</span>
          <img
            src={reload_btn}
            alt="새로고침"
            className={styles.reload_icon}
            onClick={reloadMyReservCards}
          />
        </header>
        <div className={styles.mobile_section_title}>공연 예매 내역</div>
        <div className={styles.mobile_reservlist}>
          {isLoading && (
            <div className={loadingStyles.loading}>
              <div className={loadingStyles.loadingSpinner}></div>
              <div className={loadingStyles.loadingText}>
                예매 내역을 불러오고 있습니다
                <span className={loadingStyles.loadingDots}>...</span>
              </div>
              <div className={loadingStyles.loadingSubtext}>
                잠시만 기다려주세요
              </div>
            </div>
          )}
          {!isLoading && !error && myReservCards.length === 0 && (
            <div className={styles.no_reserv}>예매 내역이 없습니다.</div>
          )}
          {!isLoading &&
            !error &&
            myReservCards.map((myReservCard) => (
              <MyReservCard key={myReservCard.scheduleId} data={myReservCard} />
            ))}
        </div>
        <LoginOverModal
          isOpen={isLoginOverModalOpen}
          onClose={() => setIsLoginOverModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <AccountInfoCard formData={formData} />
          <ProfileInfoCard formData={formData} />
          <ProfileUpdateBtn onClick={ProfileUpdateBtn} />
        </div>
        <div className={styles.container}>
          <div className={styles.container_header}>
            <div className={styles.reservlist_title}>
              공연 예매 내역{" "}
              <span style={{ color: "gray", fontSize: "20px" }}>(최신순)</span>
            </div>
            <div className={styles.reload_btn_box}>
              <img
                src={reload_btn}
                alt="새로고침"
                className={styles.reload_icon}
                onClick={reloadMyReservCards}
              />
            </div>
          </div>
          <div className={styles.reservlist_content}>
            <div className={styles.reservlist_content}>
              {isLoading && (
                <div className={loadingStyles.loading}>
                  <div className={loadingStyles.loadingSpinner}></div>
                  <div className={loadingStyles.loadingText}>
                    예매 내역을 불러오고 있습니다
                    <span className={loadingStyles.loadingDots}>...</span>
                  </div>
                  <div className={loadingStyles.loadingSubtext}>
                    잠시만 기다려주세요
                  </div>
                </div>
              )}
              {!isLoading && !error && myReservCards.length === 0 && (
                <div className={styles.no_reserv}>예매 내역이 없습니다.</div>
              )}
              {!isLoading &&
                !error &&
                myReservCards.map((myReservCard) => (
                  <div
                    key={myReservCard.scheduleId * Math.random()}
                    className="myreservcard"
                  >
                    <MyReservCard data={myReservCard} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <LoginOverModal
        isOpen={isLoginOverModalOpen}
        onClose={() => setIsLoginOverModalOpen(false)}
      />
      {isServerErrorModalOpen && (
        <ServerErrorModal
          isOpen={isServerErrorModalOpen}
          onClose={handleServerErrorModalClose}
        />
      )}
    </>
  );
}

export default Mypage;
