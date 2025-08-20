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
  const { user, isLoggedIn, isManager, token, authLoading } = useAuthStore();

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

  const [selectedReservations, setSelectedReservations] = useState(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showBatchActions, setShowBatchActions] = useState(false);

  const handleServerErrorModalClose = () => {
    setIsServerErrorModalOpen(false);
    setError("");
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || !isManager()) {
      navigate("/login", { replace: true });
      return;
    }
  }, [isLoggedIn, isManager, navigate, authLoading]);

  const handleTokenExpired = () => {
    setIsLoading(false);
    setIsLoginOverModalOpen(true);
    setError("토큰이 만료되었습니다. 다시 로그인해주세요.");
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
          setIsLoginOverModalOpen(true);
          setError("로그인이 필요합니다.");
          setIsLoading(false);
          return;
        }

        const apiUrl = `/mypage/manager/holder/${scheduleId}`;
        const response = await apiClient.get(apiUrl);
        const data = response.data || {};

        setHolderData({
          title: data.title || "공연 예매자 목록",
          order: data.order || 0,
          reservation_list: data.holderList || [],
          csv_json: data.csv_json || [],
        });
      } catch (err) {
        if (
          err.name === "TypeError" &&
          (err.message.includes("fetch") ||
            err.message.includes("NetworkError") ||
            err.message.includes("Failed to fetch"))
        ) {
          setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
          setIsServerErrorModalOpen(true);
        } else if (err.message && err.message.includes("timeout")) {
          setError("요청 시간이 초과되었습니다. 다시 시도해주세요.");
          setIsServerErrorModalOpen(true);
        } else {
          setError(
            err.message || "예매자 목록을 불러오는 중 오류가 발생했습니다."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (authLoading) return;

    if (scheduleId && token) {
      fetchHolderList();
    } else {
      setIsLoading(false);
    }
  }, [scheduleId, token, authLoading]);

  const handlePaymentToggle = async (reservationId, currentStatus) => {
    try {
      const newIsPaid = currentStatus === "입금완료" ? false : true;

      const requestData = {
        reservationList: [
          {
            reservationId,
            isPaid: newIsPaid,
          },
        ],
      };

      const apiUrl = `/mypage/manager/holder/${scheduleId}`;
      const response = await apiClient.put(apiUrl, requestData);

      if (response.status === 401) {
        if (!token || (!isLoggedIn && isManager())) {
          handleTokenExpired();
        } else {
          const userRole = user?.authority || "ROLE_USER";
          alert(`입금상태 변경 권한이 부족합니다. 현재 역할: ${userRole}`);
        }
        return;
      }

      setHolderData((prev) => ({
        ...prev,
        reservation_list: prev.reservation_list.map((item) =>
          item.reservationId === reservationId
            ? { ...item, isPaid: newIsPaid }
            : item
        ),
      }));
    } catch (err) {
      setError(err.message || "입금 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleIndividualDelete = async (reservationId, reservationName) => {
    if (
      !window.confirm(
        `"${reservationName}"님의 예매를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      return;
    }

    try {
      const requestData = { reservationList: [{ reservationId }] };
      const apiUrl = `/mypage/manager/holder/${scheduleId}`;
      const response = await apiClient.post(apiUrl, requestData);

      if (response.status === 401) {
        if (!token || (!isLoggedIn && isManager())) {
          handleTokenExpired();
        } else {
          const userRole = user?.authority || "ROLE_USER";
          alert(`삭제 권한이 부족합니다. 현재 역할: ${userRole}`);
        }
        return;
      }

      const responseData = response.data || {};
      if (responseData.success === false) {
        throw new Error("백엔드에서 삭제 처리를 실패했습니다.");
      }

      setHolderData((prev) => ({
        ...prev,
        reservation_list: prev.reservation_list.filter(
          (item) => item.reservationId !== reservationId
        ),
      }));

      alert(`${reservationName}님의 예매가 삭제되었습니다.`);
    } catch (err) {
      alert("예매 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

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
    } catch (err) {
      alert("CSV 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleSelectReservation = (reservationId) => {
    const newSelected = new Set(selectedReservations);

    if (newSelected.has(reservationId)) newSelected.delete(reservationId);
    else newSelected.add(reservationId);

    setSelectedReservations(newSelected);

    const totalCount = holderData.reservation_list?.length || 0;
    setIsAllSelected(newSelected.size === totalCount && totalCount > 0);
  };

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
    )
      return;

    try {
      const requestData = {
        reservationList: selectedIds.map((id) => ({
          reservationId: id,
          isPaid: newStatus,
        })),
      };
      const apiUrl = `/mypage/manager/holder/${scheduleId}`;
      const response = await apiClient.put(apiUrl, requestData);

      if (response.status === 401) {
        handleTokenExpired();
        return;
      }

      setHolderData((prev) => ({
        ...prev,
        reservation_list: prev.reservation_list.map((item) =>
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
    } catch (err) {
      alert("입금상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

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
    )
      return;

    try {
      const requestData = {
        reservationList: selectedIds.map((id) => ({ reservationId: id })),
      };
      const apiUrl = `/mypage/manager/holder/${scheduleId}`;
      const response = await apiClient.post(apiUrl, requestData);

      if (response.status === 401) {
        if (!token || (!isLoggedIn && isManager())) {
          handleTokenExpired();
        } else {
          const userRole = user?.authority || "ROLE_USER";
          alert(`삭제 권한이 부족합니다. 현재 역할: ${userRole}`);
        }
        return;
      }

      const responseData = response.data || {};
      if (responseData.success === false) {
        throw new Error("백엔드에서 일괄 삭제 처리를 실패했습니다.");
      }

      setHolderData((prev) => ({
        ...prev,
        reservation_list: prev.reservation_list.filter(
          (item) => !selectedIds.includes(item.reservationId)
        ),
      }));

      setSelectedReservations(new Set());
      setIsAllSelected(false);
      setShowBatchActions(false);

      alert(`${selectedIds.length}건의 예매자가 삭제되었습니다.`);
    } catch (err) {
      alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    setShowBatchActions(selectedReservations.size > 0);
  }, [selectedReservations]);

  const handleRetry = () => {
    if (scheduleId && token) {
      setIsLoading(true);
      setError(null);
      // re-trigger fetch by updating token/state; effect depends on token and scheduleId
      // no-op here since useEffect will run when token changes; otherwise we can call fetch directly if needed
    }
  };

  const formatReservationData = (reservation_list) =>
    reservation_list.map((item, index) => ({
      id: item.reservationId || index,
      date: item.createdAt || new Date().toLocaleDateString(),
      name: item.name || "-",
      stdId: item.stdCode || "-",
      phone: item.phoneNumber || "-",
      count: item.ticketNumber || 0,
      price: item.price || 0,
      status:
        item.isPaid === true || item.isPaid === "true" ? "입금완료" : "미입금",
      cancel: item.cancelRequest || false,
    }));

  if (authLoading || isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>
            {authLoading
              ? "인증 상태 확인 중"
              : "예매자 목록을 불러오고 있습니다"}
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
                  <td>{Number(row.price).toLocaleString()}</td>
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

      {isLoginOverModalOpen && (
        <LoginOverModal
          isOpen={isLoginOverModalOpen}
          onClose={() => setIsLoginOverModalOpen(false)}
        />
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
// token parsing and request debug logs removed
