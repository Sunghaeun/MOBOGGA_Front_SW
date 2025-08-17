/*eslint-disable*/
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/ManagerShowpage.module.css";
import loadingStyles from "../../styles/Loading.module.css";
import AccountInfoCard from "../../components/Mypage/AccountInfoCard";
import ManagerProfileInfoCard from "../../components/Mypage/ManagerProfileInfoCard";
import ManagerProfileUpdateBtn from "../../components/Mypage/ManagerProfileUpdateBtn";
import ClubUpdateBtn from "../../components/Manager/ClubUpdateBtn";
import ShowManageCard from "../../components/Manager/ShowManageCard";
import LoginOverModal from "../../components/Mypage/LoginOverModal";
import tokenManager from "../../utils/tokenManager";

function ManagerShowpage() {
  const navigate = useNavigate();

  // TokenManager 사용으로 변경
  const token = tokenManager.getToken();
  const userRole = tokenManager.getUserRole();

  const [formData, setFormData] = useState({
    name: "",
    clubName: "",
    phoneNum: "",
    email: "",
    clubPoster: "",
  });

  const [isLoginOverModalOpen, setIsLoginOverModalOpen] = useState(false); // 상태 추가
  const [showManageCards, setShowManageCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 토큰과 역할 확인
    if (!token || !tokenManager.isTokenValid() || userRole !== "ROLE_CLUB") {
      navigate("/404", { replace: true });
      return;
    }
  }, [token, userRole, navigate]);

  const handleTokenExpired = () => {
    console.log("=== MANAGER TOKEN EXPIRED HANDLER CALLED ===");
    console.log("Setting isLoginOverModalOpen to true");

    // TokenManager를 통해 토큰 제거
    tokenManager.clearToken();

    setIsLoginOverModalOpen(true);
    setError("토큰이 만료되었습니다. 다시 로그인해주세요.");
    console.log("Modal state should be:", true);
  };

  const fetchManagerProfile = async () => {
    try {
      console.log(
        "Fetching manager profile with token:",
        token?.substring(0, 20) + "..."
      );

      // 환경변수 체크
      if (!process.env.REACT_APP_API_URL) {
        throw new Error("API URL이 설정되지 않았습니다.");
      }

      console.log("API URL:", process.env.REACT_APP_API_URL);

      const response = await tokenManager.safeFetch(
        `${process.env.REACT_APP_API_URL}/mypage/manager/profile`,
        {
          timeout: 10000, // 10초 타임아웃
        }
      );

      console.log("Manager profile response status:", response.status);
      console.log("Manager profile response ok:", response.ok);

      if (response.status === 401 || response.status === 403) {
        console.log(
          "Manager token expired or forbidden - calling handleTokenExpired"
        );
        handleTokenExpired();
        return;
      }

      if (!response.ok) {
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
      console.log("Error in fetchManagerProfile:", error);

      // 네트워크 에러 처리
      if (
        error.name === "TypeError" &&
        (error.message.includes("fetch") ||
          error.message.includes("NetworkError") ||
          error.message.includes("Failed to fetch"))
      ) {
        setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
      } else if (error.message.includes("timeout")) {
        setError("요청 시간이 초과되었습니다. 다시 시도해주세요.");
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getShowManageCards = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await tokenManager.safeFetch(
        `${process.env.REACT_APP_API_URL}/mypage/manager/show`,
        {
          credentials: "include",
          timeout: 10000, // 10초 타임아웃
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleTokenExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(
          `서버 응답 오류 (${response.status}): 공연 내역을 불러오는데 실패했습니다.`
        );
      }

      const data = await response.json();
      console.log("Show 전체 응답 데이터:", data);

      // 다양한 가능한 데이터 구조 체크
      let performanceList = null;
      if (data && data.performanceList) {
        performanceList = data.performanceList;
      } else if (data && data.showList) {
        performanceList = data.showList;
      } else if (data && data.reservationList) {
        performanceList = data.reservationList;
      } else if (data && Array.isArray(data)) {
        performanceList = data;
      } else if (data && data.data) {
        performanceList = data.data;
      }

      if (!performanceList) {
        console.log(
          "사용 가능한 데이터 구조를 찾을 수 없습니다. 전체 응답:",
          data
        );
        performanceList = []; // 빈 배열로 설정
      }

      setShowManageCards(performanceList);
      console.log("설정된 공연 내역 데이터:", performanceList);
    } catch (err) {
      console.error("에러 발생:", err);

      // 네트워크 에러 처리
      if (
        err.name === "TypeError" &&
        (err.message.includes("fetch") ||
          err.message.includes("NetworkError") ||
          err.message.includes("Failed to fetch"))
      ) {
        setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
      } else if (err.message.includes("timeout")) {
        setError("요청 시간이 초과되었습니다. 다시 시도해주세요.");
      } else {
        setError(err.message);
      }
      setShowManageCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 정보 조회
  useEffect(() => {
    console.log("ManagerShowpage 컴포넌트 마운트됨");
    console.log("Token exists:", !!token);
    console.log("User role:", userRole);

    if (!token) {
      console.log("토큰이 없습니다. 로그인이 필요합니다.");
      // 토큰이 없으면 404 페이지로 리다이렉트
      navigate("/404", { replace: true });
      return;
    }

    if (!tokenManager.isTokenValid()) {
      console.log("토큰이 만료되었습니다.");
      handleTokenExpired();
      return;
    }

    fetchManagerProfile();
    getShowManageCards();
  }, [token, navigate]);

  // 토큰 또는 타입이 유효하지 않은 경우 렌더링 중단
  if (!token || !tokenManager.isTokenValid() || userRole !== "ROLE_CLUB") {
    return null;
  }

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
              >
                예매자 목록
              </div>
              <div
                className={styles.category_list}
                onClick={() => navigate("/manager/show")}
                id={styles.highlight}
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
                  공연 목록을 불러오고 있습니다
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
            >
              예매자 목록
            </div>
            <div
              className={styles.category_list}
              onClick={() => navigate("/manager/show")}
              id={styles.highlight}
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
              {isLoading && (
                <div className={loadingStyles.loading}>
                  <div className={loadingStyles.loadingSpinner}></div>
                  <div className={loadingStyles.loadingText}>
                    공연 목록을 불러오고 있습니다
                    <span className={loadingStyles.loadingDots}>...</span>
                  </div>
                  <div className={loadingStyles.loadingSubtext}>
                    잠시만 기다려주세요
                  </div>
                </div>
              )}
              {/* {error && (
                <div className="error-message">
                  에러: {error}
                  <button onClick={getMyReservCards} className="retry-button">
                    다시 시도
                  </button>
                </div>
              )} */}
              {!isLoading && !error && showManageCards.length === 0 && (
                <div className={styles.no_show}>공연 내역이 없습니다.</div>
              )}
              {!isLoading &&
                !error &&
                showManageCards.length > 0 &&
                showManageCards.map((showManageCard) => (
                  <div
                    key={showManageCard.scheduleId * Math.random()}
                    className="show_manage_card"
                  >
                    <ShowManageCard data={showManageCard} />
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

export default ManagerShowpage;
