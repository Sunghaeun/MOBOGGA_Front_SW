import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/AddInfo.module.css";
import LoginLogo from "../assets/LoginLogo.svg";
import FilledLongBtn from "../components/FilledLongBtn";
import Modal from "../components/Modal"; // 꼭 import 필요

function AddInfo() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  //eslint-disable-next-line
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    studentId: "",
  });

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/mypage/student/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("사용자 정보를 불러오는데 실패했습니다.");
        }

        const userData = await response.json();
        console.log("User Data:", userData); // 이 줄 추가

        // 서버에서 받은 데이터를 폼 데이터 형식에 맞게 변환
        setFormData({
          name: userData.name || "",
          phoneNumber: userData.phoneNumber || "",
          studentId: userData.studentId?.toString() || "", // 여기 수정
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    message: "",
    onClose: null,
  });

  const showModal = (message, callback) => {
    setFeedbackModal({
      isOpen: true,
      message,
      onClose: () => {
        setFeedbackModal({ isOpen: false, message: "", onClose: null });
        if (callback) callback();
      },
    });
  };

  const saveProfile = async () => {
    if (!(formData.name + "").trim()) {
      showModal("이름을 입력해주세요.");
      return;
    }
    if (!(formData.studentId + "").trim()) {
      showModal("학번을 입력해주세요.");
      return;
    }
    if (!(formData.phoneNumber + "").trim()) {
      showModal("전화번호를 입력해주세요.");
      return;
    }

    if (!/^\d{3}-\d{4}-\d{4}$/.test(formData.phoneNumber)) {
      showModal("전화번호 입력 형식은 다음과 같습니다. 010-1234-5678");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/mypage/student/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            phoneNumber: formData.phoneNumber,
            studentId: formData.studentId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "저장에 실패했습니다.");
      }

      showModal("추가 정보 기입이 완료되었습니다.", () => navigate("/main"));
    } catch (error) {
      console.error("Error saving profile:", error);
      showModal(error.message || "저장에 실패했습니다.");
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  // if (error) {
  //   return (
  //     <div className={styles.error}>
  //       <div className={styles.error_message}></div>에러: {error}
  //     </div>
  //   );
  // }

  return (
    <>
      <div className={styles.body}>
        <div className={styles.logo_box}>
          <img className={styles.login_logo} src={LoginLogo} alt="login_logo" />
        </div>
        <div className={styles.words_box}>
          <div className={styles.words}>
            모보까를 처음 이용하시나요? <br />
            추가 정보 기입을 통해 회원가입을 진행해주세요!
          </div>
        </div>
        <div className={styles.info_box}>
          <div className={styles.infos}>
            <div className={styles.info} id={styles.user_name_box}>
              <div className={styles.info_head}>이름</div>
              <div className={styles.info_body}>
                <input
                  name="name"
                  placeholder="이름"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.info} id={styles.std_num_box}>
              <div className={styles.info_head}>학번</div>
              <div className={styles.info_body}>
                <input
                  name="studentId"
                  placeholder="학번 8자리"
                  value={formData.studentId}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.info} id={styles.phone_num_box}>
              <div className={styles.info_head}>전화번호</div>
              <div className={styles.info_body}>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phone"
                  placeholder="010-0000-0000"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                  maxLength="13"
                />
              </div>
            </div>
          </div>
        </div>
        <FilledLongBtn
          value="모보까 시작하기"
          onClick={() => {
            if (
              !formData.name ||
              !formData.studentId ||
              !formData.phoneNumber
            ) {
              showModal("모든 정보를 입력해주세요.");
              return;
            }
            saveProfile();
          }}
        />
        <div className={styles.caution}>
          *모보까에 가입함으로써 개인정보 수집에 관해 동의하게 됩니다
        </div>
        <Modal isOpen={feedbackModal.isOpen} onClose={feedbackModal.onClose}>
          <div className={styles.modal_content}>
            <div className={styles.modal_top}>{feedbackModal.message}</div>
            <div className={styles.modal_Btns}>
              <button
                onClick={feedbackModal.onClose}
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

export default AddInfo;
