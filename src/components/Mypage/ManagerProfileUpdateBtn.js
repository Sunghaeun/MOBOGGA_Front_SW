import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/ProfileUpdateBtn.module.css";

function ManagerProfileUpdateBtn({ onClick }) {
  const navigate = useNavigate();
  const [isHoveringUpdateBtn, setIsHoveringUpdateBtn] = useState(false);

  const onClickProfileUpdateBtn = () => {
      navigate(`/manager/mypage/update`);
  };

  const onMouseOverUpdateBtn = () => {
    setIsHoveringUpdateBtn(true);
  };

  const onMouseOutUpdateBtn = () => {
    setIsHoveringUpdateBtn(false);
  };

  return (
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
  );
}

export default ManagerProfileUpdateBtn;
