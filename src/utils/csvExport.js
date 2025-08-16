// CSV 다운로드 유틸리티
export const generateCSV = (data, headers) => {
  // CSV 헤더 생성
  const csvHeaders = headers.join(",");

  // CSV 데이터 행 생성
  const csvRows = data.map((row) => {
    return headers
      .map((header) => {
        let value = row[header];

        // 값이 없으면 빈 문자열
        if (value === null || value === undefined) {
          value = "";
        }

        // 숫자가 아닌 값들을 문자열로 변환하고 쉼표나 따옴표가 있으면 따옴표로 감싸기
        value = String(value);

        // 쉼표, 따옴표, 줄바꿈이 포함된 경우 따옴표로 감싸고 내부 따옴표는 이스케이프
        if (
          value.includes(",") ||
          value.includes('"') ||
          value.includes("\n")
        ) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }

        return value;
      })
      .join(",");
  });

  // 헤더와 데이터 합치기
  return [csvHeaders, ...csvRows].join("\n");
};

export const downloadCSV = (csvContent, filename) => {
  // BOM 추가로 한글 깨짐 방지
  const BOM = "\uFEFF";
  const csvWithBOM = BOM + csvContent;

  // Blob 생성
  const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });

  // 다운로드 링크 생성
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  // 링크를 문서에 추가하고 클릭
  document.body.appendChild(link);
  link.click();

  // 정리
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatReservationDataForCSV = (reservationList, title = "") => {
  // CSV용 데이터 변환
  const csvData = reservationList.map((item, index) => {
    return {
      번호: index + 1,
      예매일자: item.date || new Date().toLocaleDateString(),
      이름: item.name || "이름 없음",
      학번: item.stdCode || "학번 없음",
      전화번호: item.phoneNumber || "전화번호 없음",
      매수: item.ticketNumber || 0,
      가격: item.price || 0,
      입금상태:
        item.isDeposit === "O" || item.isDeposit === true
          ? "입금완료"
          : "미입금",
      취소요청: item.cancelRequest ? "요청됨" : "없음",
      예매ID: item.reservationId || "",
    };
  });

  // CSV 헤더
  const headers = [
    "번호",
    "예매일자",
    "이름",
    "학번",
    "전화번호",
    "매수",
    "가격",
    "입금상태",
    "취소요청",
    "예매ID",
  ];

  return { csvData, headers };
};
