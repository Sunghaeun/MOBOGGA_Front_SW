/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/UpdateProfile.module.css";
import UpdateProfileWord from "../assets/UpdateProfileWord.svg";
import Modal from "../components/Modal";
import useAuthStore from "../stores/authStore";
import apiClient from "../utils/apiClient";

function UpdateProfile() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    userName: "",
    stdId: "",
    phoneNum: "",
  });

  const [errors, setErrors] = useState({
    userName: "",
    stdId: "",
    phoneNum: "",
  });

  // 모달 상태 관리
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    message: "",
    onClose: null,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const [isHoveringCancelBtn, setIsHoveringCancelBtn] = useState(false);
  const [isHoveringConfirmBtn, setIsHoveringConfirmBtn] = useState(false);

  // 마우스 오버 효과 핸들러
  const onMouseOverCancelBtn = () => setIsHoveringCancelBtn(true);
  const onMouseOutCancelBtn = () => setIsHoveringCancelBtn(false);
  const onMouseOverConfirmBtn = () => setIsHoveringConfirmBtn(true);
  const onMouseOutConfirmBtn = () => setIsHoveringConfirmBtn(false);

  // 모달 상태 관리
  const [isUpdateConfirmModalOpen, setIsUpdateConfirmModalOpen] =
    useState(false);
  const [isUpdateCancelModalOpen, setIsUpdateCancelModalOpen] = useState(false);
  const [validationErrorModal, setValidationErrorModal] = useState({
    isOpen: false,
    message: "",
  });

  const closeValidationErrorModal = () => {
    setValidationErrorModal({ isOpen: false, message: "" });
  };

  const openUpdateConfirmModal = () => {
    if (!formData.userName?.trim()) {
      setValidationErrorModal({
        isOpen: true,
        message: "이름을 입력해주세요.",
      });
      return;
    }
    if (!formData.stdId?.trim()) {
      setValidationErrorModal({
        isOpen: true,
        message: "학번을 입력해주세요.",
      });
      return;
    }
    if (!formData.phoneNum?.trim()) {
      setValidationErrorModal({
        isOpen: true,
        message: "전화번호를 입력해주세요.",
      });
      return;
    }
    if (!/^\d{3}-\d{4}-\d{4}$/.test(formData.phoneNum)) {
      setValidationErrorModal({
        isOpen: true,
        message: "전화번호 입력 형식은 다음과 같습니다. 010-1234-5678",
      });
      return;
    }
    setIsUpdateConfirmModalOpen(true);
  };

  const closeUpdateConfirmModal = () => setIsUpdateConfirmModalOpen(false);
  const openUpdateCancelModal = () => setIsUpdateCancelModalOpen(true);
  const closeUpdateCancelModal = () => setIsUpdateCancelModalOpen(false);

  const handleUpdateConfirmCancel = () => {
    closeUpdateConfirmModal();
  };

  const handleUpdateConfirmConfirm = async () => {
    try {
      await saveProfile();
      closeUpdateConfirmModal();
      navigate("/mypage");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleUpdateCancelConfirm = () => {
    closeUpdateCancelModal();
    navigate("/mypage");
  };
  const handleUpdateCancelCancel = () => {
    closeUpdateCancelModal();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 사용자 정보 조회
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get("/mypage/student/profile");
        const userData = response.data;
        setFormData({
          userName: userData.name || "",
          stdId: userData.studentId?.toString() || "",
          phoneNum: userData.phoneNumber || "",
        });
      } catch (error) {
        console.error("프로필 정보 조회 실패:", error);
        setValidationErrorModal({
          isOpen: true,
          message: error.message || "사용자 정보를 불러오는데 실패했습니다.",
        });
        setFeedbackModal({
          isOpen: true,
          message: error.message || "사용자 정보를 불러오는데 실패했습니다.",
          onClose: () =>
            setFeedbackModal({ isOpen: false, message: "", onClose: null }),
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "stdId") {
      newValue = value.replace(/[^\d]/g, "");
    } else if (name === "phoneNum") {
      const onlyNums = value.replace(/[^\d]/g, "");
      if (onlyNums.length < 4) newValue = onlyNums;
      else if (onlyNums.length < 8)
        newValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
      else
        newValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(
          3,
          7
        )}-${onlyNums.slice(7, 11)}`;
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "이름을 입력해주세요.";
    if (!/^\d{8}$/.test(formData.stdId))
      newErrors.stdId = "학번 8자리를 입력해주세요.";
    if (!/^\d{3}-\d{4}-\d{4}$/.test(formData.phoneNum))
      newErrors.phoneNum = "전화번호 형식은 010-1234-5678입니다.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    try {
      const response = await apiClient.put("/mypage/student/profile", {
        name: formData.userName,
        phoneNumber: formData.phoneNum,
        studentId: formData.stdId,
      });
      showModal("프로필 정보가 수정되었습니다.", () => navigate("/mypage"));
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "저장에 실패했습니다.";
      showModal(errorMessage);
      throw error;
    }
  };

  const handleSubmit = () => {
    if (!formData.userName || !formData.stdId || !formData.phoneNum) {
      showModal("모든 정보를 입력해주세요.");
      return;
    }
    if (validateFields()) saveProfile();
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }
  if (isMobile && window.innerWidth <= 600) {
    return (
      <div className={styles.body}>
        <div className={styles.logo_box}>
          <img
            className={styles.login_logo}
            src={UpdateProfileWord}
            alt="프로필 정보 수정"
          />
        </div>
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
          <span className={styles.header_title}>프로필 수정</span>
        </header>
        <div className={styles.info_box}>
          <div className={styles.infos}>
            <div className={styles.info}>
              <div className={styles.info_head}>이름</div>
              <div className={styles.info_body}>
                <input
                  type="text"
                  maxLength="20"
                  name="userName"
                  placeholder="이름을 입력해주세요."
                  value={formData.userName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.userName ? styles.inputError : ""
                  }`}
                />
                {errors.userName && (
                  <div className={styles.errorMessage}>{errors.userName}</div>
                )}
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.info_head}>학번</div>
              <div className={styles.info_body}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="8"
                  name="stdId"
                  placeholder="학번 8자리를 입력해주세요."
                  value={formData.stdId}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.stdId ? styles.inputError : ""
                  }`}
                />
                {errors.stdId && (
                  <div className={styles.errorMessage}>{errors.stdId}</div>
                )}
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.info_head}>전화번호</div>
              <div className={styles.info_body}>
                <input
                  type="text"
                  name="phoneNum"
                  placeholder="전화번호를 입력해주세요."
                  value={formData.phoneNum}
                  onChange={handleInputChange}
                  maxLength={13}
                  className={`${styles.input} ${
                    errors.phoneNum ? styles.inputError : ""
                  }`}
                />
                {errors.phoneNum && (
                  <div className={styles.errorMessage}>{errors.phoneNum}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.btn_box}>
          <div className={styles.start_btn} onClick={handleSubmit}>
            프로필 수정하기
          </div>
        </div>
        <Modal isOpen={feedbackModal.isOpen} onClose={feedbackModal.onClose}>
          <div className={styles.modal_top}>
            {feedbackModal.message.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
          <div className={styles.modal_Btns}>
            <button
              onClick={feedbackModal.onClose}
              className={styles.modal_ok_Btn}
            >
              확인
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <div className={styles.title_box}>
        <div className={styles.title}>
          <img src={UpdateProfileWord} alt="프로필 정보 수정" />
        </div>
      </div>
      <div className={styles.info_box}>
        <div className={styles.infos}>
          <div className={styles.info}>
            <div className={styles.info_head}>이름</div>
            <div className={styles.info_body}>
              <input
                type="text"
                maxLength="20"
                name="userName"
                placeholder="이름을 입력해주세요."
                value={formData.userName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.info_head}>학번</div>
            <div className={styles.info_body}>
              <input
                type="text"
                inputMode="numeric"
                maxLength="8"
                name="stdId"
                placeholder="학번 8자리를 입력해주세요."
                value={formData.stdId}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.info_head}>전화번호</div>
            <div className={styles.info_body}>
              <input
                type="text"
                name="phoneNum"
                placeholder="전화번호를 입력해주세요."
                value={formData.phoneNum}
                onChange={handleInputChange}
                maxLength={13}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.button_box}>
        <div
          className={styles.button}
          id={
            isHoveringCancelBtn
              ? styles.cancel_button_hover
              : styles.cancel_button
          }
          onMouseOver={onMouseOverCancelBtn}
          onMouseOut={onMouseOutCancelBtn}
          onClick={openUpdateCancelModal}
        >
          <div className={styles.button_text} id={styles.cancel_button_text}>
            취소
          </div>
        </div>
        <div
          className={styles.button}
          id={
            isHoveringConfirmBtn
              ? styles.confirm_button_hover
              : styles.confirm_button
          }
          onMouseOver={onMouseOverConfirmBtn}
          onMouseOut={onMouseOutConfirmBtn}
          onClick={openUpdateConfirmModal}
        >
          <div className={styles.button_text} id={styles.confirm_button_text}>
            확인
          </div>
        </div>
      </div>
      <Modal
        isOpen={isUpdateConfirmModalOpen}
        onClose={() => setIsUpdateConfirmModalOpen(false)}
      >
        <div className={styles.modal_content}>
          <div className={styles.modal_top}>
            프로필 정보를 수정하시겠습니까?
          </div>
          <div className={styles.modal_Btns}>
            <button
              onClick={handleUpdateConfirmCancel}
              className={styles.modal_close_Btn}
            >
              취소
            </button>
            <button
              onClick={handleUpdateConfirmConfirm}
              className={styles.modal_ok_Btn}
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isUpdateCancelModalOpen}
        onClose={() => setIsUpdateCancelModalOpen(false)}
      >
        <div className={styles.modal_content}>
          <div className={styles.modal_top}>이 페이지에서 나가시겠습니까?</div>
          <div className={styles.modal_con}>
            작성 중인 내용은 저장되지 않습니다.
          </div>
          <div className={styles.modal_Btns}>
            <button
              onClick={handleUpdateCancelConfirm}
              className={styles.modal_ok_Btn}
            >
              확인
            </button>
            <button
              onClick={handleUpdateCancelCancel}
              className={styles.modal_close_Btn}
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={validationErrorModal.isOpen}
        onClose={closeValidationErrorModal}
      >
        <div className={styles.modal_content}>
          <div className={styles.modal_top}>{validationErrorModal.message}</div>
          <div className={styles.modal_Btns}>
            <button
              onClick={closeValidationErrorModal}
              className={styles.modal_ok_Btn}
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UpdateProfile;
