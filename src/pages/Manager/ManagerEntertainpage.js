/*eslint-disable*/
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/ManagerEntertainpage.module.css";
import AccountInfoCard from "../../components/Mypage/AccountInfoCard";
import ProfileInfoCard from "../../components/Mypage/ProfileInfoCard";
import ProfileUpdateBtn from "../../components/Mypage/ProfileUpdateBtn";
import ReservManageCard from "../../components/Manager/ReservManageCard";
import LoginOverModal from "../../components/Mypage/LoginOverModal";

function ManagerEntertainpage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");
  const type = localStorage.getItem("type");

  localStorage.setItem("type", "manager");

  useEffect(() => {
    if (!token || !type || type !== "manager") {
      navigate("/404", { replace: true });
      return null;
    }
  }, [token, type, navigate]);

  if (!token || !type || type !== "manager") {
    return null; // 컴포넌트 렌더링을 중단
  }

  const [formData, setFormData] = useState({
    userName: "",
    stdId: "",
    phoneNum: "",
    email: "",
  });

  const [isLoginOverModalOpen, setIsLoginOverModalOpen] = useState(false); // 상태 추가
  const [reservManageCards, setReservManageCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchManagerProfile = async () => {
    try {
      const response = await fetch(
        // `${process.env.REACT_APP_API_URL}/manager/mypage/profile`,
        `${process.env.REACT_APP_API_URL}/mypage/student/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("사용자 정보를 불러오는데 실패했습니다.");
      }

      const managerData = await response.json();
      console.log("manager Data:", managerData);

      // 서버에서 받은 데이터를 폼 데이터 형식에 맞게 변환
      setFormData({
        userName: managerData.name || "",
        email: managerData.email || "",
        phoneNum: managerData.phoneNumber || "",
        stdId: managerData.studentId || "",
      });
    } catch (error) {
      setIsLoginOverModalOpen(true);
      console.error("Error fetching manager profile:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getReservManageCards = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        // `${process.env.REACT_APP_API_URL}/mypage/manager/reservation`,
        `${process.env.REACT_APP_API_URL}/mypage/student/reservation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("공연 내역을 불러오는데 실패했습니다.");
      }

      const data = await response.json();

      if (!data || !data.performanceList) {
        throw new Error("공연 내역 데이터 형식이 올바르지 않습니다.");
      }

      setReservManageCards(data.performanceList || []);
      console.log("공연 내역 데이터:", data.performanceList);
    } catch (err) {
      console.error("에러 발생:", err);
      setError(err.message);
      setReservManageCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 정보 조회
  useEffect(() => {
    fetchManagerProfile();
    getReservManageCards();
  }, []);

  if (isLoading) {
    console.log("로딩 중 화면 렌더링");
    return (
      <>
        <div className={styles.loading}>로딩중...</div>
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
          <ProfileInfoCard formData={formData} type="manager" />
          <ProfileUpdateBtn onClick={ProfileUpdateBtn} />
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
            <div className={styles.content}>
              {isLoading && <div className="loading">로딩중...</div>}
              {/* {error && (
                <div className="error-message">
                  에러: {error}
                  <button onClick={getMyReservCards} className="retry-button">
                    다시 시도
                  </button>
                </div>
              )} */}
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

export default ManagerEntertainpage;
