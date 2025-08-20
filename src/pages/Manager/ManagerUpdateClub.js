import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/ManagerUpdateClub.module.css";
import UpdateClubWord from "../../assets/UpdateClubWord.svg";
import Modal from "../../components/Modal";
import ServerErrorModal from "../../components/Mypage/ServerErrorModal";
import useAuthStore from "../../stores/authStore";
import apiClient from "../../utils/apiClient";

import instaIcon from "../../assets/icons/instagram.svg";
import kakaoIcon from "../../assets/icons/kakao.svg";
import youtubeIcon from "../../assets/icons/youtube.svg";
import urlIcon from "../../assets/icons/linkicons.svg";
import clubDefaultImage from "../../assets/manager/club_default.svg";

function ManagerUpdateClub() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null); // 실제 파일 저장용
  const {
    user,
    isLoggedIn,
    isLoading: authLoading,
    isManager,
    token,
  } = useAuthStore();

  // 매니저 권한 여부를 변수로 저장
  const isManagerUser = isManager();

  // 초기 권한 체크
  useEffect(() => {
    // 초기 권한 및 로그인 검사
    if (authLoading) return;

    if (!isLoggedIn || !isManagerUser) {
      navigate("/login", { replace: true });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isManagerUser, authLoading, navigate]);

  const [formData, setFormData] = useState({
    clubName: "",
    userName: "",
    phoneNum: "",
    description: "",
    instagram: "",
    kakao: "",
    youtube: "",
    url: "",
    semester: "",
    imageUrl: "",
  });

  // 모달 상태 관리
  const [isUpdateConfirmModalOpen, setIsUpdateConfirmModalOpen] =
    useState(false);
  const [isServerErrorModalOpen, setIsServerErrorModalOpen] = useState(false);
  const [validationErrorModal, setValidationErrorModal] = useState({
    isOpen: false,
    message: "",
  });
  const [validationSuccessModal, setValidationSuccessModal] = useState({
    isOpen: false,
    message: "",
  });
  const [error, setError] = useState(null);
  const [isUpdateCancelModalOpen, setIsUpdateCancelModalOpen] = useState(false);

  const handleServerErrorModalClose = () => {
    setIsServerErrorModalOpen(false);
    setError("");
  };

  const closeValidationErrorModal = () => {
    setValidationErrorModal({ isOpen: false, message: "" });
  };

  const closeValidationSuccessModal = () => {
    setValidationSuccessModal({ isOpen: false, message: "" });
  };

  const openUpdateConfirmModal = () => {
    if (!isLoggedIn || !isManagerUser) {
      setValidationErrorModal({
        isOpen: true,
        message: "로그인이 필요합니다. 다시 로그인해주세요.",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    setIsUpdateConfirmModalOpen(true);
  };

  const closeUpdateConfirmModal = () => setIsUpdateConfirmModalOpen(false);

  const handleUpdateConfirmCancel = () => closeUpdateConfirmModal();

  const handleUpdateConfirmConfirm = async () => {
    try {
      // proceed with update

      if (!isLoggedIn || !isManagerUser) {
        navigate("/login");
        return;
      }

      await saveProfile();
      closeUpdateConfirmModal();
      setValidationSuccessModal({
        isOpen: true,
        message: "동아리 정보가 성공적으로 수정되었습니다.",
      });

      // 성공 후 잠시 대기 후 페이지 이동
      setTimeout(() => {
        if (isLoggedIn && isManagerUser) {
          navigate("/manager/mypage");
        }
      }, 1500);
    } catch (error) {
      // error saving profile
      closeUpdateConfirmModal();

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
          message: `저장 중 오류가 발생했습니다: ${error.message}`,
        });
      }
    }
  };

  // 사용자 정보 조회
  useEffect(() => {
    const fetchClubProfile = async () => {
      // 인증 로딩 중이거나 권한이 없으면 실행하지 않음
      if (authLoading || !isLoggedIn || !isManagerUser) {
        return;
      }

      try {
        const response = await apiClient.get("/mypage/manager/club");

        const userData = response.data;
        setFormData({
          clubName: userData.clubName || "",
          userName: userData.managerName || userData.userName || "",
          phoneNum: userData.phoneNumber || "",
          description: userData.content || "",
          instagram: userData.instaUrl || "",
          kakao: userData.url || "",
          youtube: userData.youtubeUrl || "",
          url: userData.url || "",
          semester:
            userData.mandatorySemesters ||
            userData.mandatorySemester ||
            userData.semester ||
            "",
          imageUrl:
            userData.poster || userData.photo || userData.imageUrl || "",
        });
        // form data initialized
      } catch (error) {
        // error fetching club profile
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
            message: `오류가 발생했습니다: ${error.message}`,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchClubProfile();
  }, [authLoading, isLoggedIn, isManagerUser, token, user, navigate]);

  // formData 변경 감지용 useEffect
  useEffect(() => {
    // formData updated
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      return newData;
    });
  };

  // 이미지 변경 버튼 클릭 핸들러
  const handleImageChangeClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 타입 검증
      if (!file.type.startsWith("image/")) {
        setValidationErrorModal({
          isOpen: true,
          message: "이미지 파일만 업로드할 수 있습니다.",
        });
        return;
      }

      // 파일 크기 검증 (예: 5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrorModal({
          isOpen: true,
          message: "파일 크기는 5MB 이하여야 합니다.",
        });
        return;
      }

      // 미리보기를 위해 FileReader 사용
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          imageUrl: e.target.result,
        }));
      };
      reader.readAsDataURL(file);

      // 실제 파일도 저장
      setSelectedFile(file);

      // selected file set
    }
  };

  const saveProfile = async () => {
    if (!isLoggedIn || !isManagerUser) {
      alert("로그인이 필요하거나 매니저 권한이 없습니다.");
      navigate("/login");
      return;
    }

    // 서버에 보낼 데이터 구조
    const requestData = {
      content: formData.description,
      instaUrl: formData.instagram,
      kakaoUrl: formData.kakao,
      youtubeUrl: formData.youtube,
      url: formData.url,
      mandatorySemesters: formData.semester,
      image: formData.poster || formData.photo || formData.imageUrl || "",
    };

    const formDataToSend = new FormData();
    formDataToSend.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );
    if (selectedFile instanceof File) {
      formDataToSend.append(
        "image",
        selectedFile,
        selectedFile.name || "image.jpg"
      );
    }

    // requestData and formData prepared for submission (debug logs removed)

    try {
      await apiClient.put("/mypage/manager/club", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // 저장 성공
    } catch (error) {
      // 저장 오류 발생
      if (error?.response?.status === 401) {
        // 401 에러 처리: 권한/토큰 문제 가능
      }
      alert(
        `저장 실패: ${
          error.response?.data?.message || error.message || "알 수 없는 오류"
        }`
      );
      throw error;
    }
  };

  const openUpdateCancelModal = () => setIsUpdateCancelModalOpen(true);
  const closeUpdateCancelModal = () => setIsUpdateCancelModalOpen(false);

  const handleUpdateCancelConfirm = () => {
    closeUpdateCancelModal();
    navigate("/manager/mypage");
  };

  const handleUpdateCancelCancel = () => {
    closeUpdateCancelModal();
  };

  if (isLoading)
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <div className={styles.loadingText}>
          동아리 정보를 불러오고 있습니다
          <span className={styles.loadingDots}>...</span>
        </div>
        <div className={styles.loadingSubtext}>잠시만 기다려주세요</div>
      </div>
    );

  return (
    <div className={styles.body}>
      <div className={styles.title_box}>
        <div className={styles.title}>
          <img src={UpdateClubWord} alt="동아리 정보 수정" />
        </div>
      </div>
      <div className={styles.info_box}>
        <div className={styles.club_content}>
          <div className={styles.image_upload_box}>
            <img
              src={formData.imageUrl || clubDefaultImage}
              alt="동아리 이미지"
              className={styles.club_img}
            />
            <button
              type="button"
              className={styles.img_change_btn}
              onClick={handleImageChangeClick}
            >
              이미지 변경
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className={styles.club_side}>
          <div className={styles.info}>
            <div className={styles.info_head}>소개글</div>
            <textarea
              name="description"
              className={styles.textarea}
              value={formData.description}
              onChange={handleInputChange}
              rows={7}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.info_head}>필수학기</div>
            <input
              name="semester"
              placeholder="숫자로만 입력"
              value={formData.semester}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.info_head}>관련링크</div>
            <div className={styles.link_box}>
              <div className={styles.link}>
                <img src={instaIcon} alt="Instagram" />
                <input
                  name="instagram"
                  placeholder="https://instagram.com/..."
                  value={formData.instagram}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.link}>
                <img src={kakaoIcon} alt="Kakao" />
                <input
                  name="kakao"
                  placeholder="http://kakao.com/..."
                  value={formData.kakao}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.link}>
                <img src={youtubeIcon} alt="YouTube" />
                <input
                  name="youtube"
                  placeholder="https://youtube.com/..."
                  value={formData.youtube}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.link}>
                <img src={urlIcon} alt="url" />
                <input
                  name="url"
                  placeholder="https://example.com/..."
                  value={formData.url}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.button_box}>
        <button
          className={styles.update_button}
          onClick={openUpdateConfirmModal}
        >
          수정하기
        </button>
        <button
          className={styles.cancel_button}
          onClick={openUpdateCancelModal}
        >
          취소하기
        </button>
      </div>
      <Modal
        isOpen={isUpdateConfirmModalOpen}
        onClose={closeUpdateConfirmModal}
      >
        <div className={styles.modal_content}>
          <div className={styles.modal_top}>
            동아리 정보를 수정하시겠습니까?
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
      <Modal
        isOpen={validationSuccessModal.isOpen}
        onClose={closeValidationSuccessModal}
      >
        <div className={styles.modal_content}>
          <div className={styles.modal_top}>
            {validationSuccessModal.message}
          </div>
          <div className={styles.modal_Btns}>
            <button
              onClick={closeValidationSuccessModal}
              className={styles.modal_ok_Btn}
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isUpdateCancelModalOpen} onClose={closeUpdateCancelModal}>
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
      {isServerErrorModalOpen && (
        <ServerErrorModal
          onClose={handleServerErrorModalClose}
          message={error || "서버 오류가 발생했습니다."}
        />
      )}
    </div>
  );
}

export default ManagerUpdateClub;
