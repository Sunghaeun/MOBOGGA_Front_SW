/*eslint-disable*/
import { useState, useEffect } from "react";
import styles from "./styles/ManagerMypage.module.css";
import reload_btn from "../../assets/temp/reload_btn.png";
import AccountInfoCard from "../../components/Mypage/AccountInfoCard";
import ProfileInfoCard from "../../components/Mypage/ProfileInfoCard";
import ProfileUpdateBtn from "../../components/Mypage/ProfileUpdateBtn";
import MyReservCard from "../../components/Mypage/MyReservCard";

function ManagerMypage() {
  const [formData, setFormData] = useState({
    userName: "",
    stdId: "",
    phoneNum: "",
    email: "",
  });

  const [myReservCards, setMyReservCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("jwt");

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
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

      const userData = await response.json();
      console.log("User Data:", userData);

      // 서버에서 받은 데이터를 폼 데이터 형식에 맞게 변환
      setFormData({
        userName: userData.name || "",
        email: userData.email || "",
        phoneNum: userData.phoneNumber || "",
        stdId: userData.studentId || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getMyReservCards = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
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
        throw new Error("예매 내역을 불러오는데 실패했습니다.");
      }

      const data = await response.json();

      if (!data || !data.performanceList) {
        throw new Error("예매 내역 데이터 형식이 올바르지 않습니다.");
      }

      setMyReservCards(data.performanceList || []);
      console.log("예매 내역 데이터:", data.performanceList);
    } catch (err) {
      console.error("에러 발생:", err);
      setError(err.message);
      setMyReservCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 정보 조회
  useEffect(() => {
    fetchUserProfile();
    getMyReservCards();
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
          <AccountInfoCard userInfo={formData} />
          <ProfileInfoCard userInfo={formData} />
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
                onClick={getMyReservCards}
              />
            </div>
          </div>
          <div className={styles.reservlist_content}>
            <div className={styles.reservlist_content}>
              {isLoading && <div className="loading">로딩중...</div>}
              {/* {error && (
                <div className="error-message">
                  에러: {error}
                  <button onClick={getMyReservCards} className="retry-button">
                    다시 시도
                  </button>
                </div>
              )} */}
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
    </>
  );
}

export default ManagerMypage;
