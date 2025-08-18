// 공연 관리 데이터용 CSV 포맷터
export const formatShowDataForCSV = (showList, title = "공연 관리 목록") => {
  const csvData = showList.map((item, index) => {
    return {
      번호: index + 1,
      공연명: item.title || item.name || "공연명 없음",
      공연일시: item.showDate || item.date || "일시 미정",
      장소: item.venue || item.location || "장소 미정",
      가격: item.price || 0,
      총좌석수: item.totalSeats || item.capacity || 0,
      예매완료: item.reservedSeats || item.booked || 0,
      잔여좌석: (item.totalSeats || 0) - (item.reservedSeats || 0),
      예매율:
        item.totalSeats > 0
          ? `${Math.round(
              ((item.reservedSeats || 0) / item.totalSeats) * 100
            )}%`
          : "0%",
      상태: item.status || "진행중",
      스케줄ID: item.scheduleId || item.id || "",
    };
  });

  const headers = [
    "번호",
    "공연명",
    "공연일시",
    "장소",
    "가격",
    "총좌석수",
    "예매완료",
    "잔여좌석",
    "예매율",
    "상태",
    "스케줄ID",
  ];

  return { csvData, headers };
};

// 리크루팅 데이터용 CSV 포맷터
export const formatRecruitingDataForCSV = (
  recruitingList,
  title = "리크루팅 목록"
) => {
  const csvData = recruitingList.map((item, index) => {
    return {
      번호: index + 1,
      제목: item.title || "제목 없음",
      동아리명: item.clubName || "동아리명 없음",
      모집분야: item.category || item.field || "분야 미정",
      모집인원: item.recruitCount || item.maxCount || 0,
      지원자수: item.applicantCount || item.currentCount || 0,
      마감일: item.deadline || item.endDate || "마감일 미정",
      상태: item.status || "모집중",
      작성일: item.createdAt || item.createDate || "작성일 미정",
      리크루팅ID: item.recruitingId || item.id || "",
    };
  });

  const headers = [
    "번호",
    "제목",
    "동아리명",
    "모집분야",
    "모집인원",
    "지원자수",
    "마감일",
    "상태",
    "작성일",
    "리크루팅ID",
  ];

  return { csvData, headers };
};

// 즐길거리 데이터용 CSV 포맷터
export const formatEntertainDataForCSV = (
  entertainList,
  title = "행사 목록"
) => {
  const csvData = entertainList.map((item, index) => {
    return {
      번호: index + 1,
      제목: item.title || item.name || "제목 없음",
      카테고리: item.category || item.type || "카테고리 미정",
      장소: item.location || item.venue || "장소 미정",
      일시: item.date || item.datetime || "일시 미정",
      가격: item.price || 0,
      조회수: item.viewCount || item.views || 0,
      좋아요: item.likeCount || item.likes || 0,
      상태: item.status || "활성",
      작성일: item.createdAt || item.createDate || "작성일 미정",
      ID: item.entertainId || item.id || "",
    };
  });

  const headers = [
    "번호",
    "제목",
    "카테고리",
    "장소",
    "일시",
    "가격",
    "조회수",
    "좋아요",
    "상태",
    "작성일",
    "ID",
  ];

  return { csvData, headers };
};
