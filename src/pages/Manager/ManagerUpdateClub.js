import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/ManagerUpdateClub.module.css";
import UpdateClubWord from "../../assets/UpdateClubWord.svg";
import Modal from "../../components/Modal";

import instaIcon from "../../assets/icons/snsicons.svg";
import kakaoIcon from "../../assets/icons/kakao.svg";
import youtubeIcon from "../../assets/icons/youtubeicons.svg";
import linktreeIcon from "../../assets/icons/linkicons.svg";

function ManagerUpdateClub() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");
  const [isLoading, setIsLoading] = useState(true);

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

  const [isHoveringCancelBtn, setIsHoveringCancelBtn] = useState(false);
  const [isHoveringConfirmBtn, setIsHoveringConfirmBtn] = useState(false);

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

  const onMouseOverCancelBtn = () => setIsHoveringCancelBtn(true);
  const onMouseOutCancelBtn = () => setIsHoveringCancelBtn(false);
  const onMouseOverConfirmBtn = () => setIsHoveringConfirmBtn(true);
  const onMouseOutConfirmBtn = () => setIsHoveringConfirmBtn(false);

  const openUpdateConfirmModal = () => {
    if (!formData.clubName?.trim()) {
      setValidationErrorModal({
        isOpen: true,
        message: "동아리명을 입력해주세요.",
      });
      return;
    }
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
    setIsUpdateConfirmModalOpen(true);
  };

  const closeUpdateConfirmModal = () => setIsUpdateConfirmModalOpen(false);
  const openUpdateCancelModal = () => setIsUpdateCancelModalOpen(true);
  const closeUpdateCancelModal = () => setIsUpdateCancelModalOpen(false);

  const handleUpdateConfirmCancel = () => closeUpdateConfirmModal();
  const handleUpdateCancelCancel = () => closeUpdateCancelModal();

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

  // 사용자 정보 조회
  useEffect(() => {
    const fetchManagerProfile = async () => {
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
        if (!response.ok)
          throw new Error("사용자 정보를 불러오는데 실패했습니다.");
        const userData = await response.json();
        setFormData({
          clubName: userData.clubName || "",
          userName:
            userData.managerName || userData.userName || userData.name || "",
          phoneNum: userData.phoneNumber || "",
          description: userData.description || "",
          instagram: userData.instagram || "",
          kakao: userData.kakao || "",
          youtube: userData.youtube || "",
          linktree: userData.linktree || "",
          semester: userData.semester || "",
          imageUrl: userData.imageUrl || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchManagerProfile();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = async () => {
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
            clubName: formData.clubName,
            managerName: formData.userName,
            phoneNumber: formData.phoneNum,
            description: formData.description,
            instagram: formData.instagram,
            kakao: formData.kakao,
            youtube: formData.youtube,
            linktree: formData.linktree,
            semester: formData.semester,
            imageUrl: formData.imageUrl,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "저장에 실패했습니다.");
      }
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

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
              src={formData.imageUrl || "https://via.placeholder.com/320x220"}
              alt="동아리 이미지"
              className={styles.club_img}
            />
            <button className={styles.img_change_btn}>이미지 변경</button>
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
          <div className={styles.info}>
            <div className={styles.info_head}>필수학기</div>
            <input
              name="semester"
              placeholder="숫자로만 입력"
              value={formData.semester}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <div className={styles.button_box}>
        <button
          className={styles.update_button}
          onClick={openUpdateConfirmModal}
          onMouseOver={onMouseOverConfirmBtn}
          onMouseOut={onMouseOutConfirmBtn}
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

export default ManagerUpdateClub;
