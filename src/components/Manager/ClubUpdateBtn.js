import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/ClubUpdateBtn.module.css";

function ClubUpdateBtn({ onClick }) {
  const navigate = useNavigate();
  const [isHoveringUpdateBtn, setIsHoveringUpdateBtn] = useState(false);

  const onClickClubUpdateBtn = () => {
      navigate(`/manager/club/update`);
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
          ? styles.ClubUpdateBtnHover
          : styles.ClubUpdateBtnDefault
      }
      onClick={onClickClubUpdateBtn}
      onMouseOver={onMouseOverUpdateBtn}
      onMouseOut={onMouseOutUpdateBtn}
    >
      동아리 정보 수정
    </div>
  );
}

export default ClubUpdateBtn;
