import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/ManagerShowpage.module.css";
import loadingStyles from "../../styles/Loading.module.css";
import AccountInfoCard from "../../components/Mypage/AccountInfoCard";
import ManagerProfileInfoCard from "../../components/Mypage/ManagerProfileInfoCard";
import ManagerProfileUpdateBtn from "../../components/Mypage/ManagerProfileUpdateBtn";
import ClubUpdateBtn from "../../components/Manager/ClubUpdateBtn";
import ShowManageCard from "../../components/Manager/ShowManageCard";
import LoginOverModal from "../../components/Mypage/LoginOverModal";
import ServerErrorModal from "../../components/Mypage/ServerErrorModal";
import useAuthStore from "../../stores/authStore";
import apiClient from "../../utils/apiClient";

function ManagerShowpage() {
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
    console.log("=== MANAGER SHOW PAGE INIT ===");
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
  const [showManageCards, setShowManageCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 토큰과 역할 확인
    if (!token || (!isLoggedIn && isManagerUser) || userRole !== "ROLE_CLUB") {
      navigate("/login", { replace: true });
      return;
    }
  }, [token, userRole, navigate, isLoggedIn, isManagerUser]);

  const handleTokenExpired = () => {
    console.log("=== MANAGER TOKEN EXPIRED HANDLER CALLED ===");
    console.log("Setting isLoginOverModalOpen to true");

    // Zustand에서 자동 처리
    // 로그아웃은 Zustand에서 자동 처리

    setIsLoginOverModalOpen(true);
    setError("토큰이 만료되었습니다. 다시 로그인해주세요.");
    console.log("Modal state should be:", true);
  };

  const fetchManagerProfile = useCallback(async () => {
    if (!isLoggedIn || !isManagerUser) {
      console.log("권한 없음 - 매니저 프로필 조회 불가");
      return;
    }

    try {
      console.log("매니저 프로필 데이터 로드 시작");
      console.log("API 요청 전 인증 상태:", {
        tokenExists: !!token,
        tokenLength: token?.length,
        isLoggedIn,
        isManager: isManagerUser,
        userAuthority: user?.authority,
      });

      const response = await apiClient.get("/mypage/manager/profile");

      console.log("Manager profile response:", response.data);

      // 서버에서 받은 데이터를 폼 데이터 형식에 맞게 변환
      setFormData({
        clubName: response.data.clubName || "",
        name: response.data.name || "",
        phoneNum: response.data.phoneNumber || "",
        email: response.data.email || "",
        clubPoster: response.data.clubPoster || "",
      });
    } catch (error) {
      console.error("매니저 프로필 로드 실패:", error);
      console.error("에러 상세 정보:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 401) {
        console.log("401 에러 - 토큰 만료");
        handleTokenExpired();
      } else if (error.response?.status === 403) {
        setError("이 정보에 접근할 권한이 없습니다.");
        setIsServerErrorModalOpen(true);
      } else if (error.response?.status === 404) {
        setError("사용자 정보를 찾을 수 없습니다.");
        setIsServerErrorModalOpen(true);
      } else {
        setError("사용자 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
        setIsServerErrorModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn, isManagerUser, user?.authority]);

  const getShowManageCards = useCallback(async () => {
    if (!isLoggedIn || !isManagerUser) {
      console.log("권한 없음 - 공연 데이터 조회 불가");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("공연 관리 데이터 로드 시작");
      console.log("API 요청 전 인증 상태:", {
        tokenExists: !!token,
        tokenLength: token?.length,
        isLoggedIn,
        isManager: isManagerUser,
        userAuthority: user?.authority,
      });

      const response = await apiClient.get("/mypage/manager/show");

      console.log("Show 전체 응답 데이터:", response.data);

      // 다양한 가능한 데이터 구조 체크
      let performanceList = null;
      const data = response.data;

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
      console.error("공연 데이터 로드 실패:", err);
      console.error("에러 상세 정보:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.status === 401) {
        console.log("401 에러 - 토큰 만료");
        handleTokenExpired();
      } else if (err.response?.status === 403) {
        setError("이 정보에 접근할 권한이 없습니다.");
        setIsServerErrorModalOpen(true);
      } else if (err.response?.status === 404) {
        setError("공연 데이터를 찾을 수 없습니다.");
        setIsServerErrorModalOpen(true);
      } else {
        setError("공연 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
        setIsServerErrorModalOpen(true);
      }
      setShowManageCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn, isManagerUser, user?.authority]);

  // 사용자 정보 조회
  useEffect(() => {
    if (!authLoading && isLoggedIn && isManagerUser) {
      fetchManagerProfile();
      getShowManageCards();
    }
  }, [
    authLoading,
    isLoggedIn,
    isManagerUser,
    fetchManagerProfile,
    getShowManageCards,
  ]);

  // 토큰 또는 타입이 유효하지 않은 경우 렌더링 중단
  if (!token || (!isLoggedIn && isManagerUser) || userRole !== "ROLE_CLUB") {
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
                    공연 목록을 불러오고 있습니다
                    <span className={loadingStyles.loadingDots}>...</span>
                  </div>
                  <div className={loadingStyles.loadingSubtext}>
                    잠시만 기다려주세요
                  </div>
                </div>
              )}
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
                    <ShowManageCard
                      data={showManageCard}
                      onDeleted={(id) =>
                        setShowManageCards((prev) =>
                          prev.filter(
                            (s) =>
                              s?.showId !== id &&
                              s?.scheduleId !== id &&
                              s?.id !== id
                          )
                        )
                      }
                    />
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

        <ServerErrorModal
          isOpen={isServerErrorModalOpen}
          onClose={() => setIsServerErrorModalOpen(false)}
          errorMessage={error}
        />
      </div>
    </>
  );
}

export default ManagerShowpage;
