/*eslint-disable*/
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/ManagerMypage.module.css";
import AccountInfoCard from "../../components/Mypage/AccountInfoCard";
import ManagerProfileInfoCard from "../../components/Mypage/ManagerProfileInfoCard";
import ManagerProfileUpdateBtn from "../../components/Mypage/ManagerProfileUpdateBtn";
import ClubUpdateBtn from "../../components/Manager/ClubUpdateBtn";
import ReservManageCard from "../../components/Manager/ReservManageCard";
import LoginOverModal from "../../components/Mypage/LoginOverModal";

function ManagerMypage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  // 초기 토큰 체크
  useEffect(() => {
    console.log("=== MANAGER MYPAGE INIT ===");
    console.log("Token exists:", !!token);

    if (!token) {
      console.log("No token found - redirecting to 404");
      navigate("/404", { replace: true });
      return;
    }

    if (!isTokenValid()) {
      console.log("Token expired - showing login modal");
      handleTokenExpired();
      return;
    }

    console.log("Token valid - proceeding to fetch data");
  }, [token, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    clubName: "",
    phoneNum: "",
    email: "",
    clubPoster: "",
  });

  const [isLoginOverModalOpen, setIsLoginOverModalOpen] = useState(false); // 상태 추가
  const [reservManageCards, setReservManageCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 토큰 유효성 검증 함수
  const isTokenValid = () => {
    if (!token) return false;

    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      console.log("Token validation:");
      console.log("Current time:", new Date(currentTime * 1000));
      console.log("Token expires:", new Date(tokenPayload.exp * 1000));
      console.log("Token valid:", tokenPayload.exp > currentTime);

      return tokenPayload.exp > currentTime;
    } catch (e) {
      console.error("Token parsing error:", e);
      return false;
    }
  };

  // 토큰 만료 처리 함수
  const handleTokenExpired = () => {
    console.log(
      "Token expired - clearing localStorage and showing login modal"
    );
    localStorage.removeItem("jwt");
    setIsLoginOverModalOpen(true);
    setError("로그인이 만료되었습니다. 다시 로그인해주세요.");
  };

  const fetchManagerProfile = async () => {
    try {
      console.log("=== FETCH MANAGER PROFILE START ===");
      console.log("Token exists:", !!token);
      console.log("Token valid:", isTokenValid());

      if (!isTokenValid()) {
        handleTokenExpired();
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/mypage/manager/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Manager profile response status:", response.status);

      // 401/403 에러 명시적 처리
      if (response.status === 401 || response.status === 403) {
        console.log("Authentication/Authorization failed");
        const errorText = await response.text();
        console.log("Error response:", errorText);
        handleTokenExpired();
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.log("API Error response:", errorText);
        throw new Error(
          `서버 응답 오류 (${response.status}): 사용자 정보를 불러오는데 실패했습니다.`
        );
      }

      const managerData = await response.json();
      console.log("manager Data:", managerData);

      // 서버에서 받은 데이터를 폼 데이터 형식에 맞게 변환
      setFormData({
        clubName: managerData.clubName || "",
        name: managerData.name || "",
        phoneNum: managerData.phoneNumber || "",
        email: managerData.email || "",
        clubPoster: managerData.clubPoster || "",
      });
    } catch (error) {
      console.error("Error fetching manager profile:", error);

      // 네트워크 에러 vs 인증 에러 구분
      if (error.message.includes("401") || error.message.includes("403")) {
        handleTokenExpired();
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getReservManageCards = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("=== FETCH RESERVATION CARDS START ===");

      if (!isTokenValid()) {
        handleTokenExpired();
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/mypage/manager/show`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      console.log("Reservation cards response status:", response.status);

      // 401/403 에러 명시적 처리
      if (response.status === 401 || response.status === 403) {
        console.log(
          "Authentication/Authorization failed for reservation cards"
        );
        const errorText = await response.text();
        console.log("Error response:", errorText);
        handleTokenExpired();
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.log("API Error response:", errorText);
        throw new Error(
          `서버 응답 오류 (${response.status}): 공연 내역을 불러오는데 실패했습니다.`
        );
      }

      const data = await response.json();

      if (!data || !data.reservationList) {
        throw new Error("공연 내역 데이터 형식이 올바르지 않습니다.");
      }

      setReservManageCards(data.reservationList || []);
      console.log("공연 내역 데이터:", data.reservationList);
    } catch (err) {
      console.error("에러 발생:", err);

      // 네트워크 에러 vs 인증 에러 구분
      if (err.message.includes("401") || err.message.includes("403")) {
        handleTokenExpired();
      } else {
        setError(err.message);
        setReservManageCards([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 정보 조회
  useEffect(() => {
    if (token && isTokenValid()) {
      fetchManagerProfile();
      getReservManageCards();
    }
  }, []);

  if (isLoading) {
    console.log("로딩 중 화면 렌더링");
    return (
      <>
        <div className={styles.body}>
          <div className={styles.sidebar}>
            <AccountInfoCard formData={formData} />
            <ManagerProfileInfoCard formData={formData} />
            <ManagerProfileUpdateBtn onClick={ManagerProfileUpdateBtn} />
            <ClubUpdateBtn onClick={ClubUpdateBtn} />
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

  // if (error) {
  //   console.log("에러 화면 렌더링:", error);
  //   return (
  //     <>
  //       <div className={styles.error_message}>
  //         error: {error}
  //         <button onClick={getMyReservCards} className={styles.retry_button}>
  //           다시 시도
  //         </button>
  //       </div>
  //     </>
  //   );
  // }

  return (
    <>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <AccountInfoCard formData={formData} />
          <ManagerProfileInfoCard formData={formData} />
          <ManagerProfileUpdateBtn onClick={ManagerProfileUpdateBtn} />
          <ClubUpdateBtn onClick={ClubUpdateBtn} />
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
            <div className={styles.content}>
              {isLoading && <div className="loading">로딩중...</div>}
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
      </div>
    </>
  );
}

export default ManagerMypage;
