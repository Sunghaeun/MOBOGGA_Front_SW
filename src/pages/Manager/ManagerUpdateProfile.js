import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/UpdateProfile.module.css";
import UpdateProfileWord from "../../assets/UpdateProfileWord.svg";
import Modal from "../../components/Modal";
import ServerErrorModal from "../../components/Mypage/ServerErrorModal";
import useAuthStore from "../../stores/authStore";
import apiClient from "../../utils/apiClient";

function ManagerUpdateProfile() {
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
    console.log("=== MANAGER UPDATE PROFILE INIT ===");
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

  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    clubName: "",
    userName: "",
    phoneNum: "",
  });

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
  const [isServerErrorModalOpen, setIsServerErrorModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const [validationErrorModal, setValidationErrorModal] = useState({
    isOpen: false,
    message: "",
  });

  const handleServerErrorModalClose = () => {
    setIsServerErrorModalOpen(false);
    setError("");
  };

  const closeValidationErrorModal = () => {
    setValidationErrorModal({
      isOpen: false,
      message: "",
    });
  };

  const openUpdateConfirmModal = () => {
    if (!formData.userName?.trim()) {
      setValidationErrorModal({
        isOpen: true,
        message: "담당자 이름을 입력해주세요.",
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

    // 유효성 통과 시 확인 모달 열기
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
      navigate("/manager/mypage");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleUpdateCancelConfirm = () => {
    closeUpdateCancelModal();
    navigate("/manager/mypage");
  };
  const handleUpdateCancelCancel = () => {
    closeUpdateCancelModal();
  };

  // 사용자 정보 조회
  useEffect(() => {
    const fetchManagerProfile = async () => {
      // 인증 로딩 중이거나 권한이 없으면 실행하지 않음
      if (authLoading || !isLoggedIn || !isManagerUser) {
        return;
      }

      try {
        console.log("=== FETCH MANAGER PROFILE START ===");
        console.log("현재 토큰 상태:", !!token);
        console.log("현재 사용자 정보:", user);

        const response = await apiClient.get("/mypage/manager/profile");
        console.log("Manager profile response:", response.data);

        const userData = response.data;
        console.log("Manager Data:", userData);

        setFormData({
          clubName: userData.clubName || "",
          userName:
            userData.managerName || userData.userName || userData.name || "",
          phoneNum: userData.phoneNumber || "",
        });
        console.log("userData:", userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (
          error.code === "ECONNABORTED" ||
          error.name === "TypeError" ||
          (error.message && error.message.includes("fetch"))
        ) {
          setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
          setIsServerErrorModalOpen(true);
        } else {
          setValidationErrorModal({
            isOpen: true,
            message: `오류가 발생했습니다: ${
              error.message || "사용자 정보를 불러오는데 실패했습니다."
            }`,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagerProfile();
  }, [authLoading, isLoggedIn, isManagerUser, token, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = async () => {
    try {
      console.log("=== SAVE PROFILE START ===");
      console.log("현재 토큰 상태:", !!token);
      console.log("현재 사용자 정보:", user);

      if (!isLoggedIn || !isManagerUser) {
        console.log("권한 없음 - 로그인 페이지로 리다이렉트");
        navigate("/login");
        return;
      }

      const requestData = {
        clubName: formData.clubName,
        name: formData.userName,
        phoneNumber: formData.phoneNum,
      };

      console.log("Request data:", requestData);

      const response = await apiClient.put(
        "/mypage/manager/profile",
        requestData
      );
      console.log("Save response:", response.data);
    } catch (error) {
      console.error("Error saving profile:", error);
      if (
        error.code === "ECONNABORTED" ||
        error.name === "TypeError" ||
        (error.message && error.message.includes("fetch"))
      ) {
        setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
        setIsServerErrorModalOpen(true);
        throw error;
      } else {
        throw new Error(error.message || "저장에 실패했습니다.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <div className={styles.loadingText}>
          프로필 정보를 불러오고 있습니다
          <span className={styles.loadingDots}>...</span>
        </div>
        <div className={styles.loadingSubtext}>잠시만 기다려주세요</div>
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
          <div className={styles.info} id={styles.user_name_box}>
            <div className={styles.info_head}>동아리명</div>
            <div className={styles.info_body}>
              <input
                name="clubName"
                value={formData.clubName}
                onChange={handleInputChange}
                disabled
                style={{
                  backgroundColor: "#f5f5f5",
                  color: "#666",
                  cursor: "not-allowed",
                }}
              />
            </div>
          </div>
          <div className={styles.info} id={styles.user_name_box}>
            <div className={styles.info_head}>담당자</div>
            <div className={styles.info_body}>
              <input
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.info} id={styles.phone_num_box}>
            <div className={styles.info_head}>전화번호</div>
            <div className={styles.info_body}>
              <input
                type="tel"
                name="phoneNum"
                id="phone"
                placeholder="010-0000-0000"
                pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                maxLength="13"
                value={formData.phoneNum}
                onChange={handleInputChange}
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
      {isServerErrorModalOpen && (
        <ServerErrorModal
          onClose={handleServerErrorModalClose}
          message={error || "서버 오류가 발생했습니다."}
        />
      )}
    </div>
  );
}

export default ManagerUpdateProfile;
