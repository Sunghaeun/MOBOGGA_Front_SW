import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles/ManagerHolderList.module.css";
import TrashDefault from "../../assets/icons/trash_default.svg";
import LoginOverModal from "../../components/Mypage/LoginOverModal";

function ManagerHolderList() {
  const { scheduleId } = useParams();
  const [holderData, setHolderData] = useState({
    title: "",
    order: 0,
    reservation_list: [],
    csv_json: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginOverModalOpen, setIsLoginOverModalOpen] = useState(false);

  const token = localStorage.getItem("jwt");

  console.log("=== TOKEN DEBUG INFO ===");
  console.log("Current token:", token);
  console.log("Token length:", token?.length);
  console.log("Token exists:", !!token);
  console.log("scheduleId:", scheduleId);
  console.log("========================");

  const handleTokenExpired = () => {
    console.log("=== MANAGER TOKEN EXPIRED HANDLER CALLED ===");
    console.log("Setting isLoginOverModalOpen to true");

    // 토큰 만료 전 정보 로깅
    const expiredToken = localStorage.getItem("jwt");
    if (expiredToken) {
      try {
        const tokenPayload = JSON.parse(atob(expiredToken.split(".")[1]));
        console.log("Expired token payload:", tokenPayload);
        console.log("Token exp:", new Date(tokenPayload.exp * 1000));
        console.log("Current time:", new Date());
      } catch (e) {
        console.log("Token parsing error:", e);
      }
    }

    // 만료된 토큰 즉시 제거
    localStorage.removeItem("jwt");

    setIsLoginOverModalOpen(true);
    setError("토큰이 만료되었습니다. 다시 로그인해주세요.");
    console.log("Modal state should be:", true);
  };

  useEffect(() => {
    const fetchHolderList = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!scheduleId) {
          throw new Error("스케줄 ID가 없습니다.");
        }

        if (!token) {
          console.log("토큰이 없습니다. 로그인이 필요합니다.");
          console.log("Previous login state may have been lost");
          console.log("Possible causes:");
          console.log("1. Token expired naturally");
          console.log("2. Token removed by another tab/window");
          console.log("3. localStorage cleared");
          console.log("4. Server invalidated the token");
          setIsLoginOverModalOpen(true);
          setError("로그인이 필요합니다.");
          return;
        }

        console.log("Fetching holder list for scheduleId:", scheduleId);
        console.log("Token role:", "ROLE_CLUB");

        // 토큰 상세 분석
        if (token) {
          try {
            const tokenPayload = JSON.parse(atob(token.split(".")[1]));
            console.log("=== TOKEN PAYLOAD ===");
            console.log("Subject:", tokenPayload.sub);
            console.log("Role:", tokenPayload.role);
            console.log("Expires at:", new Date(tokenPayload.exp * 1000));
            console.log("Current time:", new Date());
            console.log(
              "Token valid:",
              new Date(tokenPayload.exp * 1000) > new Date()
            );
            console.log("====================");
          } catch (e) {
            console.log("Token parsing error:", e);
          }
        }

        // 단일 API 엔드포인트로 집중 테스트
        const apiUrl = `${process.env.REACT_APP_API_URL}/mypage/manager/holder/${scheduleId}`;
        console.log("🔄 API 요청:", apiUrl);
        console.log(
          "🔑 Authorization Header:",
          `Bearer ${token?.substring(0, 20)}...`
        );
        console.log("📋 Headers:", {
          Authorization: `Bearer ${token?.substring(0, 20)}...`,
          "Content-Type": "application/json",
        });

        let response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("📡 응답 상태:", response.status);
        console.log(
          "📡 응답 헤더:",
          Object.fromEntries(response.headers.entries())
        );

        // 응답 내용 미리보기 (에러인 경우)
        let processedResponse = response;
        if (!response.ok) {
          try {
            const responseText = await response.text();
            console.log("📡 에러 응답 내용:", responseText);

            // JSON 파싱 시도
            let errorData;
            try {
              errorData = JSON.parse(responseText);
              console.log("📡 파싱된 에러 데이터:", errorData);
            } catch (parseError) {
              console.log("📡 응답이 JSON이 아님:", responseText);
            }

            // 새로운 응답 객체 생성 (이미 읽은 응답을 다시 사용하기 위해)
            processedResponse = new Response(responseText, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            });
          } catch (textError) {
            console.log("📡 응답 텍스트 읽기 실패:", textError);
          }
        }

        console.log("📋 동일한 토큰으로 작동하는 API들:");
        console.log("✅ /mypage/manager/profile - 성공");
        console.log("✅ /mypage/manager/show - 성공");
        console.log("❌ /mypage/manager/holder/" + scheduleId + " - 실패");
        console.log("🤔 scheduleId가 유효한가?", scheduleId);
        console.log("🤔 해당 스케줄이 이 클럽 소유인가?");

        if (
          processedResponse.status === 401 ||
          processedResponse.status === 403
        ) {
          console.log("❌ 401/403 에러 - 가능한 원인들:");
          console.log("1. scheduleId가 존재하지 않음");
          console.log("2. scheduleId가 다른 클럽의 소유");
          console.log("3. holder API에만 특별한 권한이 필요");
          console.log("4. API 엔드포인트 자체가 존재하지 않음");

          // 401 에러의 경우 토큰 만료 처리
          if (processedResponse.status === 401) {
            console.log("토큰 만료 또는 인증 실패 - handleTokenExpired 호출");
            handleTokenExpired();
            return;
          } else {
            setError(
              `접근이 금지되었습니다. (상태: ${processedResponse.status})`
            );
          }
          return;
        }

        if (!processedResponse.ok) {
          throw new Error(
            `서버 응답 오류 (${processedResponse.status}): 예매자 목록을 불러오는데 실패했습니다.`
          );
        }

        const data = await processedResponse.json();
        console.log("Holder list data:", data);

        setHolderData(data);
      } catch (err) {
        console.error("Holder list fetch error:", err);

        // 네트워크 에러 처리
        if (
          err.name === "TypeError" &&
          (err.message.includes("fetch") ||
            err.message.includes("NetworkError") ||
            err.message.includes("Failed to fetch"))
        ) {
          setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
        } else if (err.message.includes("timeout")) {
          setError("요청 시간이 초과되었습니다. 다시 시도해주세요.");
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (scheduleId) {
      fetchHolderList();
    } else {
      setIsLoading(false);
    }
  }, [scheduleId, token]);

  // 재시도 함수
  const handleRetry = () => {
    if (scheduleId && token) {
      setIsLoading(true);
      setError(null);
      // useEffect가 다시 실행되도록 강제로 상태 업데이트
      setHolderData((prev) => ({ ...prev }));
    }
  };

  // 예매 데이터를 테이블 형식으로 변환
  const formatReservationData = (reservation_list) => {
    return reservation_list.map((item, index) => ({
      id: item.reservation.id || index,
      date: new Date().toLocaleDateString(), // 실제 예매일자가 없어서 임시로 현재 날짜 사용
      name: item.user.name,
      stdId: item.user.stdNumber,
      phone: item.user.phoneNumber,
      count: item.reservation.ticketNumber,
      price: item.totalCost,
      status:
        item.reservation.isDeposit === "O" ||
        item.reservation.isDeposit === true
          ? "입금완료"
          : "미입금",
      cancel: false, // 취소요청 정보가 없어서 기본값으로 설정
    }));
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>로딩중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.error}>
          에러: {error}
          <button onClick={handleRetry} className={styles.retryBtn}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const tableData = formatReservationData(holderData.reservation_list || []);

  console.log(
    "ManagerHolderList render - isLoginOverModalOpen:",
    isLoginOverModalOpen
  );

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          {holderData.title || "공연 예매자 목록"}
        </div>
        <div className={styles.toolbar}>
          <button className={styles.csvBtn}>CSV 추출</button>
          <button className={styles.selectBtn}>선택 일괄 처리 ▼</button>
          <button className={styles.deleteBtn}>선택 삭제</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>예매일자</th>
              <th>이름</th>
              <th>학번</th>
              <th>전화번호</th>
              <th>매수</th>
              <th>가격</th>
              <th>입금상태</th>
              <th>취소요청</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{row.date}</td>
                  <td>{row.name}</td>
                  <td>{row.stdId}</td>
                  <td>{row.phone}</td>
                  <td>{row.count}</td>
                  <td>{row.price.toLocaleString()}</td>
                  <td>
                    <span
                      className={
                        row.status === "입금완료"
                          ? styles.statusPaid
                          : row.status === "미입금"
                          ? styles.statusUnpaid
                          : styles.statusCancel
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>
                    {row.cancel ? (
                      <button className={styles.cancelBtn}>
                        <img
                          src={TrashDefault}
                          alt="삭제"
                          style={{ width: 20, height: 20 }}
                        />
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  예매자 정보가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {console.log("Rendering LoginOverModal check:", isLoginOverModalOpen)}
      {isLoginOverModalOpen && (
        <>
          {console.log("LoginOverModal is being rendered!")}
          <LoginOverModal
            isOpen={isLoginOverModalOpen}
            onClose={() => {
              console.log("LoginOverModal onClose called");
              setIsLoginOverModalOpen(false);
            }}
          />
        </>
      )}
    </>
  );
}

export default ManagerHolderList;
