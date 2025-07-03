/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Mypage.module.css";
import MyReservCard from "../components/MyReservCard";
import Modal from "../components/Modal";
import reload_btn from "../assets/temp/reload_btn.png";

function ManagerMypage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    stdId: "",
    phoneNum: "",
    email: "",
  });

  const [isHoveringLogoutBtn, setIsHoveringLogoutBtn] = useState(false);
  const [isHoveringUpdateBtn, setIsHoveringUpdateBtn] = useState(false);

  const onMouseOverLogoutBtn = () => {
    setIsHoveringLogoutBtn(true);
  };

  const onMouseOutLogoutBtn = () => {
    setIsHoveringLogoutBtn(false);
  };

  const onMouseOverUpdateBtn = () => {
    setIsHoveringUpdateBtn(true);
  };

  const onMouseOutUpdateBtn = () => {
    setIsHoveringUpdateBtn(false);
  };

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const onClickLogoutBtn = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    navigate(`/logout`);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
    navigate(`/mypage`);
  };

  const onClickProfileUpdateBtn = () => {
    navigate(`/mypage/update`);
  };

  const [isLoginOverModalOpen, setIsLoginOverModalOpen] = useState(false);

  const handleLoginOverConfirm = () => {
    setIsLoginOverModalOpen(false);
    localStorage.removeItem("jwt");
    navigate(`/login`);
  };

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
      setIsLoginOverModalOpen(true);
      console.error("Error fetching user profile:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [myReservCards, setMyReservCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div className={styles.account_info_box}>
            <div className={styles.account_title_box}>
              <div className={styles.account_title}>현재 로그인 계정</div>
            </div>
            <div className={styles.account}>{formData.email}</div>
            <div
              className={
                isHoveringLogoutBtn
                  ? styles.LogoutBtnHover
                  : styles.LogoutBtnDefault
              }
              onClick={onClickLogoutBtn}
              onMouseOver={onMouseOverLogoutBtn}
              onMouseOut={onMouseOutLogoutBtn}
            >
              로그아웃
            </div>
          </div>
          <div className={styles.profile_info_box}>
            <div className={styles.profile_title_box}>
              <div className={styles.profile_title}>프로필</div>
            </div>
            <div className={styles.profile_detail_box}>
              <div className={styles.detail_box}>
                <div className={styles.detail_head}>이름</div>
                <div className={styles.detail_body}>{formData.userName}</div>
              </div>
              <div className={styles.detail_box}>
                <div className={styles.detail_head}>학번</div>
                <div className={styles.detail_body}>{formData.stdId}</div>
              </div>
              <div className={styles.detail_box}>
                <div className={styles.detail_head}>연락처</div>
                <div className={styles.detail_body}>{formData.phoneNum}</div>
              </div>
            </div>
          </div>
          <div
            className={
              isHoveringUpdateBtn
                ? styles.ProfileUpdateBtnHover
                : styles.ProfileUpdateBtnDefault
            }
            onClick={onClickProfileUpdateBtn}
            onMouseOver={onMouseOverUpdateBtn}
            onMouseOut={onMouseOutUpdateBtn}
          >
            프로필 정보 수정
          </div>
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
        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
        >
          <div className={styles.modal_content}>
            <div className={styles.modal_top}>로그아웃하시겠습니까?</div>
            <div className={styles.modal_Btns}>
              <button
                onClick={handleLogoutCancel}
                className={styles.modal_close_Btn}
              >
                취소
              </button>
              <button
                onClick={handleLogoutConfirm}
                className={styles.modal_ok_Btn}
              >
                확인
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={isLoginOverModalOpen}
          onClose={() => setIsLoginOverModalOpen(false)}
        >
          <div className={styles.modal_content}>
            <div className={styles.modal_top}>세션이 만료되었습니다.</div>
            <div className={styles.modal_con}>
              다시 로그인해주세요.
            </div>
            <div className={styles.modal_Btns}>
              <button
                onClick={handleLoginOverConfirm}
                className={styles.modal_ok_Btn}
              >
                확인
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default ManagerMypage;
