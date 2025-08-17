import styles from "./styles/ProfileInfoCard.module.css";
import clubDefaultImage from "../../assets/manager/club_default.svg";

function ManagerProfileInfoCard({ formData }) {
  return (
    <div className={styles.profileInfoCard}>
      <div className={styles.profile_info_box}>
        <div className={styles.profile_title_box}>
          <div className={styles.profile_title}>프로필</div>
        </div>
        <div className={styles.profile_detail_box}>
          <div className={styles.detail_box}>
            <img
              src={formData.clubPoster ? formData.clubPoster : clubDefaultImage}
              alt="프로필 사진"
              className={styles.profile_image}
              style={{
                width: "80%",
                height: "80%",
                objectFit: "cover",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div className={styles.detail_box}>
            <div className={styles.detail_head}>동아리명</div>
            <div className={styles.detail_body}>{formData.clubName}</div>
          </div>
          <div className={styles.detail_box}>
            <div className={styles.detail_head}>담당자 </div>
            <div className={styles.detail_body}>{formData.name}</div>
          </div>
          <div className={styles.detail_box}>
            <div className={styles.detail_head}>연락처</div>
            <div className={styles.detail_body}>{formData.phoneNum}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerProfileInfoCard;
