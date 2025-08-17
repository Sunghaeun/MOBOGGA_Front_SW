import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./styles/ManagerHolderList.module.css";
import TrashDefault from "../../assets/icons/trash_default.svg";
import PaidIcon from "../../assets/icons/paid_icon.svg";
import UnpaidIcon from "../../assets/icons/nopaid_icon.svg";
import LoginOverModal from "../../components/Mypage/LoginOverModal";
import ServerErrorModal from "../../components/Mypage/ServerErrorModal";
import useAuthStore from "../../stores/authStore";
import apiClient from "../../utils/apiClient";
import {
  generateCSV,
  downloadCSV,
  formatReservationDataForCSV,
} from "../../utils/csvExport";

function ManagerHolderList() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isManager, token } = useAuthStore();
  const [holderData, setHolderData] = useState({
    title: "",
    order: 0,
    reservation_list: [],
    csv_json: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginOverModalOpen, setIsLoginOverModalOpen] = useState(false);
  const [isServerErrorModalOpen, setIsServerErrorModalOpen] = useState(false);

  const handleServerErrorModalClose = () => {
    setIsServerErrorModalOpen(false);
    setError("");
  };

  // 초기 권한 체크
  useEffect(() => {
    console.log("=== MANAGER HOLDER LIST INIT ===");
    console.log("로그인 상태:", isLoggedIn);
    console.log("매니저 권한:", isManager());

    if (!isLoggedIn || !isManager()) {
      console.log("권한 없음 - 404로 리다이렉트");
      navigate("/login", { replace: true });
      return;
    }

    console.log("권한 확인 완료 - 데이터 조회 시작");
  }, [isLoggedIn, isManager, navigate]);

  // 선택된 예매자들 관리
  const [selectedReservations, setSelectedReservations] = useState(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showBatchActions, setShowBatchActions] = useState(false);

  console.log("=== TOKEN DEBUG INFO ===");
  console.log("Current token:", token ? "존재함" : "없음");
  console.log("Token length:", token?.length);
  console.log("Token exists:", !!token);
  console.log("Token valid:", token ? isLoggedIn && isManager() : false);
  console.log("scheduleId:", scheduleId);
  console.log("========================");

  const handleTokenExpired = () => {
    console.log("=== MANAGER TOKEN EXPIRED HANDLER CALLED ===");
    console.log("Setting isLoginOverModalOpen to true");

    const expiredToken = window.tempToken;
    if (expiredToken) {
      try {
        const tokenPayload = JSON.parse(atob(expiredToken.split(".")[1]));
        console.log("Expired token payload:", tokenPayload);
        console.log("Token exp:", new Date(tokenPayload.exp * 1000));
        console.log("Current time:", new Date());
        console.log(
          "Token actually expired:",
          new Date(tokenPayload.exp * 1000) <= new Date()
        );
      } catch (e) {
        console.log("Token parsing error:", e);
      }
    }

    console.log("🚨 토큰 만료 처리: 토큰 삭제 및 로그인 모달 표시");
    // 로그아웃은 Zustand에서 자동 처리
    setIsLoading(false);
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
          setIsLoginOverModalOpen(true);
          setError("로그인이 필요합니다.");
          setIsLoading(false);
          return;
        }

        console.log("Fetching holder list for scheduleId:", scheduleId);

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

        const apiUrl = `${process.env.REACT_APP_API_URL}/mypage/manager/holder/${scheduleId}`;
        console.log("🔄 API 요청:", apiUrl);

        let response = await apiClient.getInstance()(apiUrl, {
          credentials: "include",
        });

        console.log("📡 응답 상태:", response.status);

        if (response.status === 401 || response.status === 403) {
          if (response.status === 401) {
            console.log("토큰 만료 또는 인증 실패 - handleTokenExpired 호출");
            handleTokenExpired();
            return;
          } else {
            setError(`접근이 금지되었습니다. (상태: ${response.status})`);
          }
          return;
        }

        if (!response.ok) {
          throw new Error(
            `서버 응답 오류 (${response.status}): 예매자 목록을 불러오는데 실패했습니다.`
          );
        }

        const data = await response.json();
        console.log("Holder list data:", data);

        setHolderData({
          title: data.title || "공연 예매자 목록",
          order: data.order || 0,
          reservation_list: data.holderList || [],
          csv_json: data.csv_json || [],
        });
      } catch (err) {
        console.error("Holder list fetch error:", err);

        if (
          err.name === "TypeError" &&
          (err.message.includes("fetch") ||
            err.message.includes("NetworkError") ||
            err.message.includes("Failed to fetch"))
        ) {
          setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
          setIsServerErrorModalOpen(true);
        } else if (err.message.includes("timeout")) {
          setError("요청 시간이 초과되었습니다. 다시 시도해주세요.");
          setIsServerErrorModalOpen(true);
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

  // 입금 상태 토글 함수
  const handlePaymentToggle = async (reservationId, currentStatus) => {
    try {
      const newStatus = currentStatus === "입금완료" ? "미입금" : "입금완료";
      const newIsPaid = newStatus === "입금완료";

      const requestData = {
        reservationList: [
          {
            reservationId: reservationId,
            isPaid: newIsPaid,
          },
        ],
      };

      console.log(
        "🔄 개별 입금상태 변경 요청 데이터:",
        JSON.stringify(requestData, null, 2)
      );

      console.log("🔐 입금상태 변경 요청 전 토큰 정보:", {
        token: token ? "존재함" : "없음",
        tokenLength: token?.length,
        isValid: token ? isLoggedIn && isManager() : false,
        userRole: user?.authority || "ROLE_USER",
      });

      const apiUrl = `${process.env.REACT_APP_API_URL}/mypage/manager/holder/${scheduleId}`;

      console.log("🔍 PUT 요청 상세 정보:", {
        url: apiUrl,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.substring(0, 20)}...`,
        },
        body: JSON.stringify(requestData),
        credentials: "include",
      });

      const response = await apiClient.getInstance()(apiUrl, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      console.log("📡 개별 입금상태 변경 응답:", {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        requestData: requestData,
        newStatus: newStatus,
        currentStatus: currentStatus,
      });

      if (response.status === 401) {
        console.log(
          "⚠️ 입금상태 변경 401 오류 발생 - 토큰 문제 또는 권한 없음"
        );
        console.log("현재 요청:", newStatus, "기존 상태:", currentStatus);
        console.log("현재 토큰 상태:", {
          exists: !!token,
          length: token?.length,
          valid: token ? isLoggedIn && isManager() : false,
        });

        // 토큰이 실제로 유효하지 않은 경우에만 만료 처리
        if (!token || (!isLoggedIn && isManager())) {
          handleTokenExpired();
        } else {
          // 토큰이 유효한데 401이 발생한 경우 - 권한 문제일 가능성
          console.log(
            "🔍 입금상태 변경도 401 오류 - 권한 또는 API 문제 가능성"
          );
          const userRole = user?.authority || "ROLE_USER";
          alert(
            `❌ 입금상태 변경 권한이 부족합니다.\n\n현재 역할: ${userRole}\n\n관리자에게 권한 승급을 요청하거나, 백엔드 팀에 문의해주세요.`
          );
        }
        return;
      }

      if (!response.ok) {
        throw new Error(`입금 상태 업데이트 실패 (${response.status})`);
      }

      setHolderData((prevData) => ({
        ...prevData,
        reservation_list: prevData.reservation_list.map((item) =>
          item.reservationId === reservationId
            ? { ...item, isPaid: newIsPaid }
            : item
        ),
      }));

      console.log(
        `예매 ID ${reservationId}의 입금 상태가 ${newStatus}으로 변경되었습니다.`
      );
    } catch (error) {
      console.error("입금 상태 토글 오류:", error);
      setError(error.message);
    }
  };

  // 개별 예매 삭제 함수
  const handleIndividualDelete = async (reservationId, reservationName) => {
    if (
      !window.confirm(
        `"${reservationName}"님의 예매를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      return;
    }

    try {
      const requestData = {
        reservationList: [
          {
            reservationId: reservationId,
          },
        ],
      };

      console.log(
        "🔄 개별 삭제 요청 데이터:",
        JSON.stringify(requestData, null, 2)
      );

      console.log("🔐 삭제 요청 전 토큰 정보:", {
        token: token ? "존재함" : "없음",
        tokenLength: token?.length,
        isValid: token ? isLoggedIn && isManager() : false,
        userRole: user?.authority || "ROLE_USER",
      });

      const apiUrl = `${process.env.REACT_APP_API_URL}/mypage/manager/holder/${scheduleId}`;

      console.log("🔍 DELETE 요청 상세 정보:", {
        url: apiUrl,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.substring(0, 20)}...`,
        },
        body: JSON.stringify(requestData),
        credentials: "include",
      });

      const response = await apiClient.getInstance()(apiUrl, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      // 응답 헤더도 확인
      const responseHeaders = {};
      for (let [key, value] of response.headers.entries()) {
        responseHeaders[key] = value;
      }

      console.log("📡 개별 삭제 응답:", {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        requestData: requestData,
        responseHeaders: responseHeaders,
      });

      if (response.status === 401) {
        console.log("⚠️ 개별 삭제 401 오류 발생 - 토큰 문제 또는 권한 없음");
        console.log("현재 토큰 상태:", {
          exists: !!token,
          length: token?.length,
          valid: token ? isLoggedIn && isManager() : false,
        });

        // 토큰이 실제로 유효하지 않은 경우에만 만료 처리
        if (!token || (!isLoggedIn && isManager())) {
          handleTokenExpired();
        } else {
          // 토큰이 유효한데 401이 발생한 경우 - 권한 문제일 가능성
          console.log(
            "🔍 토큰은 유효하지만 401 오류 - 권한 또는 API 문제 가능성"
          );
          const userRole = user?.authority || "ROLE_USER";
          alert(
            `❌ 삭제 권한이 부족합니다.\n\n현재 역할: ${userRole}\n\n삭제 기능은 더 높은 권한이 필요할 수 있습니다.\n관리자에게 권한 승급을 요청하거나, 백엔드 팀에 문의해주세요.`
          );
        }
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.log("❌ 개별 삭제 실패 상세:", {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText,
        });
        throw new Error(`예매 삭제 실패 (${response.status}): ${errorText}`);
      }

      // 응답 본문 확인
      const responseData = await response.json().catch(() => ({}));
      console.log("✅ 개별 삭제 성공 응답:", responseData);

      // 백엔드 응답에서 실제 성공 여부 확인
      if (responseData.success === false) {
        console.log("❌ 백엔드에서 삭제 실패:", responseData);
        throw new Error("백엔드에서 삭제 처리를 실패했습니다.");
      }

      // 성공적으로 삭제되면 UI에서 해당 예매 제거
      setHolderData((prevData) => ({
        ...prevData,
        reservation_list: prevData.reservation_list.filter(
          (item) => item.reservationId !== reservationId
        ),
      }));

      console.log(`예매 ID ${reservationId} (${reservationName}님) 삭제 완료`);

      // 삭제 성공 후 선택사항: 서버에서 최신 데이터 다시 가져오기
      // 아래 주석을 해제하면 삭제 후 자동으로 새로고침됩니다
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);

      alert(`${reservationName}님의 예매가 삭제되었습니다.`);
    } catch (error) {
      console.error("개별 예매 삭제 오류:", error);
      alert("예매 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // CSV 다운로드 함수
  const handleCSVDownload = () => {
    try {
      if (
        !holderData.reservation_list ||
        holderData.reservation_list.length === 0
      ) {
        alert("다운로드할 예매자 데이터가 없습니다.");
        return;
      }

      const { csvData, headers } = formatReservationDataForCSV(
        holderData.reservation_list,
        holderData.title
      );
      const csvContent = generateCSV(csvData, headers);
      const today = new Date().toISOString().split("T")[0];
      const safeTitleName = (holderData.title || "공연예매자목록").replace(
        /[^\w\s가-힣]/gi,
        ""
      );
      const filename = `${safeTitleName}_예매자목록_${today}.csv`;

      downloadCSV(csvContent, filename);

      console.log(`CSV 다운로드 완료: ${filename}`);
      console.log(`총 ${holderData.reservation_list.length}건의 예매자 데이터`);
    } catch (error) {
      console.error("CSV 다운로드 오류:", error);
      alert("CSV 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 개별 체크박스 선택/해제
  const handleSelectReservation = (reservationId) => {
    const newSelected = new Set(selectedReservations);

    if (newSelected.has(reservationId)) {
      newSelected.delete(reservationId);
    } else {
      newSelected.add(reservationId);
    }

    setSelectedReservations(newSelected);

    const totalCount = holderData.reservation_list?.length || 0;
    setIsAllSelected(newSelected.size === totalCount && totalCount > 0);
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedReservations(new Set());
      setIsAllSelected(false);
    } else {
      const allIds = new Set(
        holderData.reservation_list?.map((item) => item.reservationId) || []
      );
      setSelectedReservations(allIds);
      setIsAllSelected(true);
    }
  };

  // 선택된 예매자들의 입금상태 일괄 변경
  const handleBatchPaymentUpdate = async (newStatus) => {
    if (selectedReservations.size === 0) {
      alert("변경할 예매자를 선택해주세요.");
      return;
    }

    const selectedIds = Array.from(selectedReservations);
    const statusText = newStatus === true ? "입금완료" : "미입금";

    if (
      !window.confirm(
        `선택된 ${selectedIds.length}건의 예매자 입금상태를 "${statusText}"로 변경하시겠습니까?`
      )
    ) {
      return;
    }

    try {
      const requestData = {
        reservationList: selectedIds.map((id) => ({
          reservationId: id,
          isPaid: newStatus,
        })),
      };

      console.log(
        "🔄 일괄 입금상태 변경 요청 데이터:",
        JSON.stringify(requestData, null, 2)
      );

      const apiUrl = `${process.env.REACT_APP_API_URL}/mypage/manager/holder/${scheduleId}`;
      const response = await apiClient.getInstance()(apiUrl, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      if (response.status === 401) {
        handleTokenExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`일괄 입금상태 업데이트 실패 (${response.status})`);
      }

      setHolderData((prevData) => ({
        ...prevData,
        reservation_list: prevData.reservation_list.map((item) =>
          selectedIds.includes(item.reservationId)
            ? { ...item, isPaid: newStatus }
            : item
        ),
      }));

      setSelectedReservations(new Set());
      setIsAllSelected(false);
      setShowBatchActions(false);

      alert(
        `${selectedIds.length}건의 예매자 입금상태가 "${statusText}"로 변경되었습니다.`
      );
      console.log(
        `일괄 입금상태 변경 완료: ${selectedIds.length}건 → ${statusText}`
      );
    } catch (error) {
      console.error("일괄 입금상태 변경 오류:", error);
      alert("입금상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 선택된 예매자들 일괄 삭제
  const handleBatchDelete = async () => {
    if (selectedReservations.size === 0) {
      alert("삭제할 예매자를 선택해주세요.");
      return;
    }

    const selectedIds = Array.from(selectedReservations);

    if (
      !window.confirm(
        `선택된 ${selectedIds.length}건의 예매자를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      return;
    }

    try {
      const requestData = {
        reservationList: selectedIds.map((id) => ({
          reservationId: id,
        })),
      };

      console.log(
        "🔄 일괄 삭제 요청 데이터:",
        JSON.stringify(requestData, null, 2)
      );

      console.log("🔐 일괄 삭제 요청 전 토큰 정보:", {
        token: token ? "존재함" : "없음",
        tokenLength: token?.length,
        isValid: token ? isLoggedIn && isManager() : false,
        userRole: user?.authority || "ROLE_USER",
      });

      const apiUrl = `${process.env.REACT_APP_API_URL}/mypage/manager/holder/${scheduleId}`;
      const response = await apiClient.getInstance()(apiUrl, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      // 응답 헤더도 확인
      const responseHeaders = {};
      for (let [key, value] of response.headers.entries()) {
        responseHeaders[key] = value;
      }

      console.log("📡 일괄 삭제 응답:", {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        requestData: requestData,
        responseHeaders: responseHeaders,
      });

      if (response.status === 401) {
        console.log("⚠️ 일괄 삭제 401 오류 발생 - 토큰 문제 또는 권한 없음");
        console.log("현재 토큰 상태:", {
          exists: !!token,
          length: token?.length,
          valid: token ? isLoggedIn && isManager() : false,
        });

        // 토큰이 실제로 유효하지 않은 경우에만 만료 처리
        if (!token || (!isLoggedIn && isManager())) {
          handleTokenExpired();
        } else {
          // 토큰이 유효한데 401이 발생한 경우 - 권한 문제일 가능성
          console.log(
            "🔍 토큰은 유효하지만 401 오류 - 권한 또는 API 문제 가능성"
          );
          const userRole = user?.authority || "ROLE_USER";
          alert(
            `❌ 일괄 삭제 권한이 부족합니다.\n\n현재 역할: ${userRole}\n\n삭제 기능은 더 높은 권한이 필요할 수 있습니다.\n관리자에게 권한 승급을 요청하거나, 백엔드 팀에 문의해주세요.`
          );
        }
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.log("❌ 일괄 삭제 실패 상세:", {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText,
        });
        throw new Error(`일괄 삭제 실패 (${response.status}): ${errorText}`);
      }

      // 응답 본문 확인
      const responseData = await response.json().catch(() => ({}));
      console.log("✅ 일괄 삭제 성공 응답:", responseData);

      // 백엔드 응답에서 실제 성공 여부 확인
      if (responseData.success === false) {
        console.log("❌ 백엔드에서 일괄 삭제 실패:", responseData);
        throw new Error("백엔드에서 일괄 삭제 처리를 실패했습니다.");
      }

      setHolderData((prevData) => ({
        ...prevData,
        reservation_list: prevData.reservation_list.filter(
          (item) => !selectedIds.includes(item.reservationId)
        ),
      }));

      setSelectedReservations(new Set());
      setIsAllSelected(false);
      setShowBatchActions(false);

      console.log(`일괄 삭제 완료: ${selectedIds.length}건`);

      // 삭제 성공 후 선택사항: 서버에서 최신 데이터 다시 가져오기
      // 아래 주석을 해제하면 삭제 후 자동으로 새로고침됩니다
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);

      alert(`${selectedIds.length}건의 예매자가 삭제되었습니다.`);
    } catch (error) {
      console.error("일괄 삭제 오류:", error);
      alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 선택 상태가 변경될 때마다 일괄 처리 메뉴 표시 여부 결정
  React.useEffect(() => {
    setShowBatchActions(selectedReservations.size > 0);
  }, [selectedReservations]);

  // 재시도 함수
  const handleRetry = () => {
    if (scheduleId && token) {
      setIsLoading(true);
      setError(null);
      setHolderData((prev) => ({ ...prev }));
    }
  };

  // 예매 데이터를 테이블 형식으로 변환
  const formatReservationData = (reservation_list) => {
    return reservation_list.map((item, index) => ({
      id: item.reservationId || index,
      date: item.date || new Date().toLocaleDateString(),
      name: item.name || "-",
      stdId: item.stdCode || "-",
      phone: item.phoneNumber || "-",
      count: item.ticketNumber || 0,
      price: item.price || 0,
      status:
        item.isPaid === true || item.isPaid === "true" ? "입금완료" : "미입금",
      cancel: item.cancelRequest || false,
    }));
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>
            예매자 목록을 불러오고 있습니다
            <span className={styles.loadingDots}>...</span>
          </div>
          <div className={styles.loadingSubtext}>잠시만 기다려주세요</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <div className={styles.errorMessage}>{error}</div>
          <button onClick={handleRetry} className={styles.retryBtn}>
            🔄 다시 시도
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
          <button
            className={styles.csvBtn}
            onClick={handleCSVDownload}
            disabled={
              !holderData.reservation_list ||
              holderData.reservation_list.length === 0
            }
            title={
              holderData.reservation_list?.length > 0
                ? `${holderData.reservation_list.length}건의 예매자 데이터를 CSV로 다운로드`
                : "다운로드할 데이터가 없습니다"
            }
          >
            📥 CSV 추출 ({holderData.reservation_list?.length || 0}건)
          </button>

          {showBatchActions && (
            <div className={styles.batchActions}>
              <span className={styles.selectedCount}>
                {selectedReservations.size}개 선택됨
              </span>
              <button
                className={styles.batchBtn}
                onClick={() => handleBatchPaymentUpdate(true)}
                title="선택된 예매자들을 입금완료로 변경"
              >
                ✅ 입금완료 처리
              </button>
              <button
                className={styles.batchBtn}
                onClick={() => handleBatchPaymentUpdate(false)}
                title="선택된 예매자들을 미입금으로 변경"
              >
                ❌ 미입금 처리
              </button>
              <button
                className={styles.batchDeleteBtn}
                onClick={handleBatchDelete}
                title="선택된 예매자들을 삭제"
              >
                🗑️ 선택 삭제
              </button>
            </div>
          )}
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  title={isAllSelected ? "전체 선택 해제" : "전체 선택"}
                />
              </th>
              <th>예매일자</th>
              <th>이름</th>
              <th>학번</th>
              <th>전화번호</th>
              <th>매수</th>
              <th>가격</th>
              <th>입금상태</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedReservations.has(row.id)}
                      onChange={() => handleSelectReservation(row.id)}
                    />
                  </td>
                  <td>{row.date}</td>
                  <td>{row.name}</td>
                  <td>{row.stdId}</td>
                  <td>{row.phone}</td>
                  <td>{row.count}</td>
                  <td>{row.price.toLocaleString()}</td>
                  <td>
                    <button
                      className={styles.paymentToggleBtn}
                      onClick={() => handlePaymentToggle(row.id, row.status)}
                      title={`클릭하여 ${
                        row.status === "입금완료" ? "미입금" : "입금완료"
                      }으로 변경`}
                    >
                      <img
                        src={row.status === "입금완료" ? PaidIcon : UnpaidIcon}
                        alt={row.status}
                        className={styles.paymentIcon}
                      />
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => handleIndividualDelete(row.id, row.name)}
                      title={`${row.name}님의 예매를 삭제`}
                    >
                      <img
                        src={TrashDefault}
                        alt="삭제"
                        style={{ width: 20, height: 20 }}
                      />
                    </button>
                    {row.cancel && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginLeft: "5px",
                        }}
                      >
                        취소요청
                      </span>
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
      {isServerErrorModalOpen && (
        <ServerErrorModal
          isOpen={isServerErrorModalOpen}
          onClose={handleServerErrorModalClose}
        />
      )}
    </>
  );
}

export default ManagerHolderList;
