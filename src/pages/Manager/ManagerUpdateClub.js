import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/ManagerUpdateClub.module.css";
import UpdateClubWord from "../../assets/UpdateClubWord.svg";
import Modal from "../../components/Modal";

import instaIcon from "../../assets/icons/snsicons.svg";
import kakaoIcon from "../../assets/icons/kakao.svg";
import youtubeIcon from "../../assets/icons/youtubeicons.svg";
import linktreeIcon from "../../assets/icons/linkicons.svg";
import clubDefaultImage from "../../assets/manager/club_default.svg";

function ManagerUpdateClub() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null); // 실제 파일 저장용

  // 토큰을 실시간으로 가져오는 함수
  const getToken = useCallback(() => localStorage.getItem("jwt"), []);

  const [formData, setFormData] = useState({
    clubName: "",
    userName: "",
    phoneNum: "",
    description: "",
    instagram: "",
    kakao: "",
    youtube: "",
    linktree: "",
    semester: "",
    imageUrl: "",
  });

  // 모달 상태 관리
  const [isUpdateConfirmModalOpen, setIsUpdateConfirmModalOpen] =
    useState(false);
  const [validationErrorModal, setValidationErrorModal] = useState({
    isOpen: false,
    message: "",
  });
  const [validationSuccessModal, setValidationSuccessModal] = useState({
    isOpen: false,
    message: "",
  });

  // 토큰 유효성 검증 함수
  const isTokenValid = useCallback(() => {
    console.log("=== TOKEN VALIDATION START ===");

    const token = getToken();
    if (!token) {
      console.log("Token validation failed: No token");
      return false;
    }

    try {
      const tokenParts = token.split(".");
      console.log("Token parts length:", tokenParts.length);

      if (tokenParts.length !== 3) {
        console.log("Token validation failed: Invalid token format");
        return false;
      }

      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;

      console.log("Token validation in ManagerUpdateClub:");
      console.log("Current time:", new Date(currentTime * 1000));
      console.log("Token expires:", new Date(tokenPayload.exp * 1000));
      console.log("Token payload:", tokenPayload);
      console.log(
        "Time difference:",
        tokenPayload.exp - currentTime,
        "seconds"
      );
      console.log("Token valid:", tokenPayload.exp > currentTime);

      return tokenPayload.exp > currentTime;
    } catch (e) {
      console.error("Token parsing error:", e);
      console.log("Token validation failed: Parsing error");
      return false;
    }
  }, [getToken]);

  // 토큰 만료 처리 함수
  const handleTokenExpired = useCallback(() => {
    console.log("Token expired in ManagerUpdateClub - redirecting to login");
    localStorage.removeItem("jwt");
    navigate("/login");
  }, [navigate]);

  const closeValidationErrorModal = () => {
    setValidationErrorModal({ isOpen: false, message: "" });
  };

  const closeValidationSuccessModal = () => {
    setValidationSuccessModal({ isOpen: false, message: "" });
  };

  const openUpdateConfirmModal = () => {
    console.log("=== OPEN UPDATE MODAL START ===");
    const token = getToken();
    console.log("Token exists:", !!token);
    console.log("Token value:", token);
    console.log("Token valid:", isTokenValid());

    if (!token) {
      console.log(
        "No token found in openUpdateConfirmModal - redirecting to login"
      );
      setValidationErrorModal({
        isOpen: true,
        message: "로그인이 필요합니다. 다시 로그인해주세요.",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    if (!isTokenValid()) {
      console.log(
        "Token invalid in openUpdateConfirmModal - redirecting to login"
      );
      setValidationErrorModal({
        isOpen: true,
        message: "세션이 만료되었습니다. 다시 로그인해주세요.",
      });
      setTimeout(() => {
        handleTokenExpired();
      }, 1500);
      return;
    }

    console.log("Token validation passed - opening modal");
    setIsUpdateConfirmModalOpen(true);
  };

  const closeUpdateConfirmModal = () => setIsUpdateConfirmModalOpen(false);

  const handleUpdateConfirmCancel = () => closeUpdateConfirmModal();

  const handleUpdateConfirmConfirm = async () => {
    try {
      console.log("=== UPDATE CONFIRMATION START ===");
      const token = getToken();
      console.log("Token exists:", !!token);
      console.log("Token valid:", isTokenValid());

      if (!token) {
        console.log("No token found - redirecting to login");
        navigate("/login");
        return;
      }

      if (!isTokenValid()) {
        handleTokenExpired();
        return;
      }

      await saveProfile();
      closeUpdateConfirmModal();
      setValidationSuccessModal({
        isOpen: true,
        message: "동아리 정보가 성공적으로 수정되었습니다.",
      });

      // 성공 후 잠시 대기 후 페이지 이동 (토큰이 여전히 유효할 때만)
      setTimeout(() => {
        const currentToken = getToken();
        if (currentToken && isTokenValid()) {
          navigate("/manager/mypage");
        }
      }, 1500);
    } catch (error) {
      console.error("Error saving profile:", error);
      closeUpdateConfirmModal();

      // 네트워크 에러 vs 인증 에러 구분
      if (error.message.includes("401") || error.message.includes("403")) {
        handleTokenExpired();
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
      try {
        console.log("=== FETCH CLUB PROFILE START ===");
        const token = getToken();
        console.log("Token exists:", !!token);
        console.log("Token valid:", isTokenValid());

        if (!token) {
          console.log("No token found - redirecting to login");
          navigate("/login");
          return;
        }

        if (!isTokenValid()) {
          handleTokenExpired();
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/mypage/manager/club`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Club profile response status:", response.status);

        // 401/403 에러 명시적 처리
        if (response.status === 401 || response.status === 403) {
          console.log("Authentication/Authorization failed for club profile");
          const errorText = await response.text();
          console.log("Error response:", errorText);
          handleTokenExpired();
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.log("API Error response:", errorText);
          throw new Error(
            `서버 응답 오류 (${response.status}): 사용자 정보를 불러오는데 실패했습니다.`
          );
        }

        const userData = await response.json();
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
          linktree: userData.notionUrl || "",
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
          linktree: userData.notionUrl,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);

        // 네트워크 에러 vs 인증 에러 구분
        if (error.message.includes("401") || error.message.includes("403")) {
          handleTokenExpired();
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
  }, [navigate, handleTokenExpired, isTokenValid, getToken]);

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
      const token = getToken();
      console.log("Token exists:", !!token);
      console.log("Token valid:", isTokenValid());

      if (!token) {
        console.log("No token found - redirecting to login");
        navigate("/login");
        return;
      }

      if (!isTokenValid()) {
        handleTokenExpired();
        return;
      }

      console.log("=== SAVE PROFILE DATA ===");
      console.log("Request body:", {
        clubName: formData.clubName,
        content: formData.description,
        instaUrl: formData.instagram,
        url: formData.kakao,
        youtubeUrl: formData.youtube,
        notionUrl: formData.linktree,
        managerName: formData.userName,
        phoneNumber: formData.phoneNum,
        mandatorySemesters: formData.semester,
      });
      console.log(
        "Selected file:",
        selectedFile ? selectedFile.name : "No file"
      );

      // FormData 사용 (파일이 있는 경우)
      let requestBody;
      let headers = {
        Authorization: `Bearer ${token}`,
      };

      if (selectedFile) {
        // 파일이 있으면 FormData 사용
        console.log("Using FormData for file upload");
        const formDataToSend = new FormData();

        // JSON 데이터를 각각의 필드로 추가 (Blob 대신)
        formDataToSend.append("clubName", formData.clubName);
        formDataToSend.append("content", formData.description);
        formDataToSend.append("instaUrl", formData.instagram);
        formDataToSend.append("url", formData.kakao);
        formDataToSend.append("youtubeUrl", formData.youtube);
        formDataToSend.append("notionUrl", formData.linktree);
        formDataToSend.append("managerName", formData.userName);
        formDataToSend.append("phoneNumber", formData.phoneNum);
        formDataToSend.append("mandatorySemesters", formData.semester);
        formDataToSend.append("poster", selectedFile);

        requestBody = formDataToSend;

        // FormData 요청을 위한 추가 헤더
        headers["Accept"] = "application/json";

        console.log("FormData contents:");
        for (let [key, value] of formDataToSend.entries()) {
          console.log(key, value);
        }
      } else {
        // 파일이 없으면 JSON으로 전송
        console.log("Using JSON for update without file");
        headers["Content-Type"] = "application/json";
        headers["Accept"] = "application/json";
        requestBody = JSON.stringify({
          clubName: formData.clubName,
          content: formData.description,
          instaUrl: formData.instagram,
          url: formData.kakao,
          youtubeUrl: formData.youtube,
          notionUrl: formData.linktree,
          poster: formData.imageUrl, // 기존 이미지 URL 유지
          managerName: formData.userName,
          phoneNumber: formData.phoneNum,
          mandatorySemesters: formData.semester,
        });
      }

      console.log("Request headers:", headers);
      console.log(
        "Request body type:",
        requestBody instanceof FormData ? "FormData" : "JSON"
      );

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/mypage/manager/club`,
        {
          method: "PUT",
          headers: headers,
          body: requestBody,
        }
      );

      console.log("Save response status:", response.status);

      // 401/403 에러 명시적 처리
      if (response.status === 401 || response.status === 403) {
        console.log("Authentication/Authorization failed for save");
        const errorText = await response.text();
        console.log("Error response:", errorText);

        // 401 에러 시 바로 로그인으로 리다이렉트하지 말고 에러 모달 표시
        throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Save API Error response:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        throw new Error(
          errorData.message ||
            `서버 응답 오류 (${response.status}): 저장에 실패했습니다.`
        );
      }
    } catch (error) {
      console.error("Error saving profile:", error);

      // 401/403 인증 에러 처리
      if (error.message.includes("인증에 실패했습니다")) {
        setValidationErrorModal({
          isOpen: true,
          message: error.message,
        });
        // 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          handleTokenExpired();
        }, 3000);
      } else {
        // 네트워크 에러 vs 기타 에러 구분
        if (error.message.includes("401") || error.message.includes("403")) {
          handleTokenExpired();
        } else {
          throw error;
        }
      }
    }
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
                <img src={linktreeIcon} alt="Linktree" />
                <input
                  name="linktree"
                  placeholder="https://linktr.ee/..."
                  value={formData.linktree}
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
    </div>
  );
}

export default ManagerUpdateClub;
