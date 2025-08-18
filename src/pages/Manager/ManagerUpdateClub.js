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
  const userRole = user?.authority;

  // 초기 권한 체크
  useEffect(() => {
    console.log("=== MANAGER UPDATE CLUB INIT ===");
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
    console.log("=== OPEN UPDATE MODAL START ===");
    console.log("Token exists:", !!token);
    console.log("로그인 상태:", isLoggedIn);
    console.log("매니저 권한:", isManagerUser);

    if (!isLoggedIn || !isManagerUser) {
      console.log("권한 없음 - 로그인 페이지로 리다이렉트");
      setValidationErrorModal({
        isOpen: true,
        message: "로그인이 필요합니다. 다시 로그인해주세요.",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    console.log("권한 확인 완료 - 모달 열기");
    setIsUpdateConfirmModalOpen(true);
  };

  const closeUpdateConfirmModal = () => setIsUpdateConfirmModalOpen(false);

  const handleUpdateConfirmCancel = () => closeUpdateConfirmModal();

  const handleUpdateConfirmConfirm = async () => {
    try {
      console.log("=== UPDATE CONFIRMATION START ===");
      console.log("Token exists:", !!token);
      console.log("로그인 상태:", isLoggedIn);
      console.log("매니저 권한:", isManagerUser);

      if (!isLoggedIn || !isManagerUser) {
        console.log("권한 없음 - 로그인 페이지로 리다이렉트");
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
      console.error("Error saving profile:", error);
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
        console.log("=== FETCH CLUB PROFILE START ===");
        console.log("현재 토큰 상태:", !!token);
        console.log("현재 사용자 정보:", user);

        const response = await apiClient.get("/mypage/manager/club");
        console.log("Club profile response:", response.data);

        const userData = response.data;
        console.log("Club Data:", userData);
        console.log("URL fields:", {
          instaUrl: userData.instaUrl,
          youtubeUrl: userData.youtubeUrl,
          notionUrl: userData.notionUrl,
          url: userData.url,
        });
        setFormData({
          clubName: userData.clubName || "",
          userName: userData.managerName || userData.userName || "",
          phoneNum: userData.phoneNumber || "",
          description: userData.content || "",
          instagram: userData.instaUrl || "",
          kakao: userData.url || "",
          youtube: userData.youtubeUrl || "",
          url: userData.notionUrl || "",
          semester:
            userData.mandatorySemesters ||
            userData.mandatorySemester ||
            userData.semester ||
            "",
          imageUrl:
            userData.poster || userData.photo || userData.imageUrl || "",
        });
        console.log("Form data set successfully:", {
          instagram: userData.instaUrl,
          kakao: userData.url,
          youtube: userData.youtubeUrl,
          url: userData.notionUrl,
        });
      } catch (error) {
        console.error("Error fetching club profile:", error);
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
    console.log("FormData updated:", formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Input change:", name, "=", value);
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      console.log("Updated formData:", newData);
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

      console.log("Selected file:", file.name, "Size:", file.size, "bytes");
    }
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

      console.log("=== SAVE PROFILE DATA ===");
      console.log("Request body:", {
        clubName: formData.clubName,
        content: formData.description,
        instaUrl: formData.instagram,
        url: formData.kakao,
        youtubeUrl: formData.youtube,
        notionUrl: formData.url,
        managerName: formData.userName,
        phoneNumber: formData.phoneNum,
        mandatorySemesters: formData.semester,
      });
      console.log(
        "Selected file:",
        selectedFile ? selectedFile.name : "No file"
      );

      if (selectedFile) {
        // 파일이 있으면 FormData 사용
        console.log("Using FormData for file upload");
        const formDataToSend = new FormData();

        // JSON 데이터를 각각의 필드로 추가
        formDataToSend.append("clubName", formData.clubName);
        formDataToSend.append("content", formData.description);
        formDataToSend.append("instaUrl", formData.instagram);
        formDataToSend.append("url", formData.kakao);
        formDataToSend.append("youtubeUrl", formData.youtube);
        formDataToSend.append("notionUrl", formData.url);
        formDataToSend.append("managerName", formData.userName);
        formDataToSend.append("phoneNumber", formData.phoneNum);
        formDataToSend.append("mandatorySemesters", formData.semester);
        formDataToSend.append("poster", selectedFile);

        console.log("FormData contents:");
        for (let [key, value] of formDataToSend.entries()) {
          console.log(key, value);
        }

        // apiClient에서 FormData 지원
        const response = await apiClient.put(
          "/mypage/manager/club",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Save response with file:", response.data);
      } else {
        // 파일이 없으면 JSON으로 전송
        console.log("Using JSON for update without file");
        const requestData = {
          clubName: formData.clubName,
          content: formData.description,
          instaUrl: formData.instagram,
          url: formData.kakao,
          youtubeUrl: formData.youtube,
          notionUrl: formData.url,
          poster: formData.imageUrl, // 기존 이미지 URL 유지
          managerName: formData.userName,
          phoneNumber: formData.phoneNum,
          mandatorySemesters: formData.semester,
        };

        const response = await apiClient.put(
          "/mypage/manager/club",
          requestData
        );
        console.log("Save response without file:", response.data);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error; // 상위에서 처리하도록 다시 throw
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
