import styles from "./styles/ProfileInfoCard.module.css";

function ManagerProfileInfoCard({ formData, type }) {
  return (
    <div className={styles.profileInfoCard}>
      <div className={styles.profile_info_box}>
        <div className={styles.profile_title_box}>
          <div className={styles.profile_title}>프로필</div>
        </div>
        <div className={styles.profile_detail_box}>
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
