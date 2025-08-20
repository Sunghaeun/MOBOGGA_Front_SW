import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import apiClient from "../utils/apiClient";
import styles from "./styles/AddInfo.module.css";
import loadingStyles from "../styles/Loading.module.css";
import LoginLogo from "../assets/LoginLogo.svg";
import Modal from "../components/Modal";

function AddInfo() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    message: "",
    onClose: null,
  });

  const [leaveModal, setLeaveModal] = useState({ isOpen: false });

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    studentId: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    studentId: "",
    phoneNumber: "",
  });

  useEffect(() => {
    // 인증 확인
    if (!authLoading && !isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get("/mypage/student/profile");

        const rawStudentId = response.data.studentId;
        const studentId =
          rawStudentId == null || Number(rawStudentId) === 0
            ? ""
            : String(rawStudentId);

        setFormData({
          name: response.data.name || "",
          phoneNumber: response.data.phoneNumber || "",
          studentId,
        });
      } catch (error) {
        // fetching user profile failed; debug output suppressed
        // 사용자 정보를 불러올 수 없어도 계속 진행 (첫 로그인일 수 있음)
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && isLoggedIn) {
      fetchUserProfile();
    }
  }, [authLoading, isLoggedIn, navigate]);

  // 작성 중인 내용이 있을 때 브라우저 새로고침/탭 닫기 경고
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const hasData =
        (formData.name && formData.name.trim()) ||
        (formData.studentId && formData.studentId.trim()) ||
        (formData.phoneNumber && formData.phoneNumber.trim());
      if (hasData) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
      return undefined;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData]);

  // 전역 플래그: 다른 컴포넌트(예: Header)에서 이동 전에 확인할 수 있도록 상태를 노출
  useEffect(() => {
    const hasData =
      (formData.name && formData.name.trim()) ||
      (formData.studentId && formData.studentId.trim()) ||
      (formData.phoneNumber && formData.phoneNumber.trim());
    try {
      window.__MBOGGA_UNSAVED = !!hasData;
    } catch (err) {
      // 환경에 따라 window 쓰기 불가할 수 있으나 무시
    }
    return () => {
      try {
        window.__MBOGGA_UNSAVED = false;
      } catch (err) {}
    };
  }, [formData]);

  const handleBack = () => {
    const hasData =
      (formData.name && formData.name.trim()) ||
      (formData.studentId && formData.studentId.trim()) ||
      (formData.phoneNumber && formData.phoneNumber.trim());
    if (hasData) {
      setLeaveModal({ isOpen: true });
    } else {
      navigate(-1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // 학번은 숫자만
    if (name === "studentId") {
      newValue = value.replace(/[^\d]/g, "");
    }

    // 전화번호는 숫자만 + 하이픈 추가
    else if (name === "phone") {
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

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  // 이름 blur 검증
  const handleNameBlur = () => {
    if (!formData.name || !formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "이름을 입력해주세요." }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  // 학번 blur 검증
  const handleStudentIdBlur = () => {
    if (!/^\d{8}$/.test(formData.studentId || "")) {
      setErrors((prev) => ({
        ...prev,
        studentId: "학번 8자리를 입력해주세요.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, studentId: "" }));
    }
  };

  // 전화번호 blur 검증
  const handlePhoneBlur = () => {
    if (!/^\d{3}-\d{4}-\d{4}$/.test(formData.phoneNumber || "")) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "전화번호 형식을 확인해주세요.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "이름을 입력해주세요.";
    if (!/^\d{8}$/.test(formData.studentId))
      newErrors.studentId = "학번 8자리를 입력해주세요.";
    if (!/^\d{3}-\d{4}-\d{4}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "전화번호 형식을 확인해주세요.";

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
      await apiClient.put("/mypage/student/profile", formData);

      // 저장 성공 시 미작성 플래그 해제
      try {
        window.__MBOGGA_UNSAVED = false;
      } catch (err) {}

      showModal("추가 정보 기입이 완료되었습니다.", () => navigate("/main"));
    } catch (error) {
      // saving profile failed; debug output suppressed

      let errorMessage = "저장에 실패했습니다.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showModal(errorMessage);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.studentId || !formData.phoneNumber) {
      showModal("모든 정보를 입력해주세요.");
      return;
    }
    if (validateFields()) saveProfile();
  };

  if (isLoading) {
    return (
      <div className={loadingStyles.loading}>
        <div className={loadingStyles.loadingSpinner}></div>
        <div className={loadingStyles.loadingText}>
          사용자 정보를 불러오고 있습니다
          <span className={loadingStyles.loadingDots}>...</span>
        </div>
        <div className={loadingStyles.loadingSubtext}>잠시만 기다려주세요</div>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <div className={styles.logo_box}>
        <img className={styles.login_logo} src={LoginLogo} alt="login_logo" />
      </div>
      <header className={styles.mobile_header}>
        <button className={styles.back_btn} onClick={handleBack}>
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
        <span className={styles.header_title}>회원가입</span>
      </header>
      <div className={styles.words_box}>
        <div className={styles.words}>
          <div className={styles.word_title}>
            <span className={styles.highlight}>모보까</span>를 처음
            이용하시나요?
          </div>
          <div className={styles.word_content}>
            추가 정보 기입을 통해 회원가입을 진행해주세요!
          </div>
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
                name="name"
                placeholder="홍길동"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleNameBlur}
              />
              {errors.name && (
                <div className={styles.errorMessage}>{errors.name}</div>
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
                name="studentId"
                placeholder="22000000"
                value={formData.studentId}
                onChange={handleInputChange}
                onBlur={handleStudentIdBlur}
                className={`${styles.input} ${
                  errors.studentId ? styles.inputError : ""
                }`}
              />
              {errors.studentId && (
                <div className={styles.errorMessage}>{errors.studentId}</div>
              )}
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.info_head}>전화번호</div>
            <div className={styles.info_body}>
              <input
                type="text"
                name="phoneNumber"
                placeholder="010-1234-5678"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={handlePhoneBlur}
                maxLength={13}
                className={styles.input}
              />
              {errors.phoneNumber && (
                <div className={styles.errorMessage}>{errors.phoneNumber}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.btn_box}>
        <div className={styles.start_btn} onClick={handleSubmit}>
          모보까 시작하기
        </div>
      </div>

      <Modal
        isOpen={leaveModal.isOpen}
        onClose={() => setLeaveModal({ isOpen: false })}
      >
        <div className={styles.modal_content}>
          <div className={styles.modal_top}>
            작성 중인 내용이 있습니다. 페이지를 나가시겠습니까?
          </div>
          <div className={styles.modal_Btns}>
            <button
              onClick={() => {
                setLeaveModal({ isOpen: false });
              }}
              className={styles.modal_close_Btn}
            >
              취소
            </button>
            <button
              onClick={() => {
                setLeaveModal({ isOpen: false });
                navigate(-1);
              }}
              className={styles.modal_ok_Btn}
            >
              나가기
            </button>
          </div>
        </div>
      </Modal>

      <div className={styles.caution}>
        *모보까에 가입함으로써 개인정보 수집에 관해 동의하게 됩니다.
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

export default AddInfo;
