/* eslint-disable */
import React, { useState, useEffect, useRef } from "react"; // useRef 추가
import styles from "./styles/ShowDetail.module.css";
import loadingStyles from "../styles/Loading.module.css";

import BACK from "../assets/ShowBackButton.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";

function ShowDetail() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState({});
  const [count, setCount] = useState(1);
  const [selectedSch, setSelectedSch] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [failModalOpen, setFailModalOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);
  const [selectSchOpen, setSelectSchOpen] = useState(false);
  const limitOkRef = useRef(null);
  const selectSchOkRef = useRef(null);

  const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
  const token = localStorage.getItem("jwt");

  const navigateToPrepage = () => navigate(-1);

  // 상세 데이터 불러오기 (토큰 있으면 Authorization 헤더 추가)
  const fetchData = async () => {
    console.log("받은 showId:", showId, typeof showId);

    console.log("저장된 토큰:", token ? "있음" : "없음");
    const url = `${process.env.REACT_APP_API_URL}/show/detail/${showId}`;
    console.log("GET:", url);

    try {
      setLoading(true);
      setError(null);

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log("Authorization 헤더 추가됨");
      }

      const res = await axios.get(url, {
        headers,
        timeout: 10000,
      });
      console.log("API 응답 성공:", res.status);
      console.log("API 응답 데이터:", res.data);
      setShow(res.data || {});
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);

      if (err.response?.status === 401) {
        console.log("401 에러 - 인증 실패");
        // 토큰이 만료되었거나 유효하지 않을 수 있음
        localStorage.removeItem("jwt");
        setError(
          "로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요."
        );
        // alert("로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.");
        // navigate("/login");
      } else if (err.response?.status === 403) {
        console.log("403 에러 - 권한 없음");
        setError("이 공연에 접근할 권한이 없습니다.");
      } else if (err.response?.status === 404) {
        console.log("404 에러 - 공연을 찾을 수 없음");
        setError("요청하신 공연을 찾을 수 없습니다.");
      } else {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      }
      setShow(null);
    } finally {
      setLoading(false);
    }
  };

  // 권한 체크 (옵션)
  const [auth, setAuth] = useState(null);
  const getAuth = async () => {
    try {
      if (!token) {
        console.log("토큰이 없어서 권한 체크 건너뜀");
        return;
      }

      console.log("권한 체크 시작...");
      const res = await axios.get(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
        timeout: 10000,
      });
      console.log("권한 체크 성공:", res.data);
      setAuth(res.data);
    } catch (e) {
      console.error("권한 체크 실패:", e);
      console.error("권한 체크 응답:", e.response);

      if (e.response?.status === 401 || e.response?.status === 403) {
        console.log("토큰이 유효하지 않음 - 제거");
        localStorage.removeItem("jwt");
        setAuth(null);
      } else {
        console.log("네트워크 에러 등으로 권한 체크 실패");
        setAuth(null);
      }
    }
  };

  useEffect(() => {
    fetchData();
    getAuth();
    // eslint-disable-next-line
  }, [showId]);

  useEffect(() => {
    if (!limitOpen) return;
    const onKey = (e) => {
      if (e.isComposing) return;
      if (e.key === "Enter") {
        e.preventDefault();
        limitOkRef.current?.click();
      }
      if (e.key === "Escape") {
        setLimitOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [limitOpen]);

  useEffect(() => {
    if (!selectSchOpen) return;
    const onKey = (e) => {
      if (e.isComposing) return;
      if (e.key === "Enter") {
        e.preventDefault();
        selectSchOkRef.current?.click();
      }
      if (e.key === "Escape") {
        setSelectSchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectSchOpen]);

  const navigateToClubDetail = (clubId) => navigate(`/clubs/${clubId}`);

  // 예매 버튼 API
  const handleReser = async () => {
    if (!selectedSch) {
      setSelectSchOpen(true);
      return;
    }
    if (!token) {
      setOpen(false);
      setFailModalOpen(true);
      return;
    }

    const requestData = {
      scheduleId: selectedSch.scheduleId,
      wishToPurchaseTickets: count,
    };

    try {
      console.log("예매 요청:", requestData);
      const url = `${API_BASE}/show/detail/reservation`;
      console.log("POST:", url);

      const res = await axios.post(url, requestData, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      console.log("예매 성공:", res.data);

      setOpen(false);
      setSecondModalOpen(true);
      setIsDisable(true);
    } catch (err) {
      console.log("예매 실패:", err);
      if (err.response) {
        console.error("서버 응답 데이터:", err.response.data);
      } else {
        console.log("서버 응답 없음(네트워크 문제)");
      }
      setOpen(false);
      setFailModalOpen(true);
    }
  };

  const reservConfirm = async () => {
    setSecondModalOpen(false);
    window.location.reload();
  };

  const formatPrice = (price) =>
    typeof price === "number" ? price.toLocaleString("ko-KR") : "0";

  useEffect(() => setCount(1), [selectedSch]);

  const Minus = () => {
    if (count > 1) setCount(count - 1);
  };
  const Plus = () => {
    if (!selectedSch) return setSelectSchOpen(true);
    const maxAvailable = Math.min(
      selectedSch.maxPeople - selectedSch.applyPeople,
      selectedSch.maxTickets
    );
    if (count < maxAvailable) setCount(count + 1);
    else if (count === selectedSch.maxTickets) setLimitOpen(true);
    else alert(`현재 ${count}매를 예매할 수 있습니다.`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return dateString;
    const parts = dateString.split("-");
    return parts.length >= 3 ? `${parts[1]}월${parts[2]}일` : dateString;
    // YYYY-MM-DD 가정
  };
  const formatTime = (timeString) => {
    if (!timeString) return timeString;
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}시${parts[1]}분` : timeString;
  };

  // 로딩
  if (loading) {
    return (
      <div className={loadingStyles.loading}>
        <div className={loadingStyles.loadingSpinner}></div>
        <div className={loadingStyles.loadingText}>
          공연 정보를 불러오고 있습니다
          <span className={loadingStyles.loadingDots}>...</span>
        </div>
        <div className={loadingStyles.loadingSubtext}>잠시만 기다려주세요</div>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className={loadingStyles.error}>
        <div className={loadingStyles.errorIcon}>⚠️</div>
        <div className={loadingStyles.errorMessage}>{error}</div>
        <div className={loadingStyles.errorActions}>
          <button
            onClick={() => fetchData()}
            className={loadingStyles.retryBtn}
          >
            🔄 다시 시도
          </button>
          <button onClick={navigateToPrepage} className={loadingStyles.backBtn}>
            ← 이전 페이지
          </button>
          {error.includes("로그인") && (
            <button
              onClick={() => navigate("/login")}
              className={loadingStyles.loginBtn}
            >
              🔑 로그인하러 가기
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.back_Div}>
        <button className={styles.back_Btn} onClick={navigateToPrepage}>
          <img src={BACK} className={styles.move_Back} alt="back" />
        </button>
      </div>

      <div className={styles.show_con}>
        <div className={styles.show_Intro}>
          <div className={styles.intro_Info}>
            <div className={styles.show_Top}>공연정보</div>
            <div className={styles.intro_con}>
              {show && (
                <img
                  src={show.photo || show.poster || show.posterUrl}
                  className={styles.show_Pic}
                  alt="show_IMG"
                />
              )}
              <div className={styles.show_Info}>
                <div className={styles.title}>
                  {show?.showName || show?.title || "타이틀 정보 없음"}
                </div>
                <div
                  className={styles.club}
                  onClick={() => navigateToClubDetail(show?.clubId)}
                >
                  {show?.clubName ? `${show?.clubName} >` : "동아리 정보 없음"}
                </div>

                <div className={styles.infos}>
                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>
                      <span className={styles.info_txt}>소개글</span>
                    </span>
                    <span className={styles.variable_Info}>
                      {show?.introductionLetter ||
                        show?.intro ||
                        "소개글 정보 없음"}
                    </span>
                  </div>

                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>
                      <span className={styles.info_txt}>장소</span>
                    </span>
                    <span className={styles.variable_Info}>
                      {show?.location || "장소 정보 없음"}
                    </span>
                  </div>

                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>
                      <span className={styles.info_txt}>날짜</span>
                    </span>
                    <span className={styles.variable_Info}>
                      {show?.startDate || "시작 날짜 정보 없음"} -{" "}
                      {show?.endDate || "끝 날짜 정보 없음"}
                    </span>
                  </div>

                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>
                      <span className={styles.info_txt}>러닝타임</span>
                    </span>
                    <span className={styles.variable_Info}>
                      {show?.runtime != null
                        ? show.runtime
                        : "러닝타임 정보 없음"}
                      {show?.runtime != null ? "분" : ""}
                    </span>
                  </div>

                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>
                      <span className={styles.info_txt}>담당자</span>
                    </span>
                    <span className={styles.variable_Info}>
                      {show?.managerPhoneNumber || "담당자 정보 없음"} {" ("}
                      {show?.manager || " "}
                      {") "}
                    </span>
                  </div>

                  <div className={styles.info_Box}>
                    <span className={styles.fixed_Info}>
                      <span className={styles.info_txt}>공지</span>
                    </span>
                    <span className={styles.variable_Info}>
                      {show?.noticeLetter || "공지 정보 없음"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.show_ticket}>
          <div className={styles.ticket_Box}>
            <div className={styles.section}>공연 회차 선택</div>
            <div className={styles.selectSch}>
              {show &&
                Array.isArray(show.scheduleList) &&
                show.scheduleList
                  .filter((sch) => sch != null)
                  .map((sch) => {
                    const isFull = sch.applyPeople >= sch.maxPeople;
                    return (
                      <label
                        className={`${styles.sch_Item} ${
                          isFull ? styles.disabled_Label : ""
                        } ${
                          selectedSch?.scheduleId === sch.scheduleId
                            ? styles.selected_Label
                            : ""
                        }`}
                        key={sch.scheduleId}
                      >
                        <input
                          type="radio"
                          value={sch.scheduleId}
                          name="schedule"
                          disabled={isFull}
                          className={styles.ticket_Radio}
                          onChange={(e) =>
                            setSelectedSch(
                              show.scheduleList.find(
                                (s) => s?.scheduleId === Number(e.target.value)
                              )
                            )
                          }
                        />
                        {sch.order}공: {sch.date}{" "}
                        {sch?.time || "시간 정보 없음"} |{" "}
                        {formatPrice(sch.cost)}원 |{" "}
                        {isFull ? (
                          <span className={styles.disabled_Label}>매진</span>
                        ) : (
                          <span className={styles.people_Count}>
                            {sch.applyPeople}/{sch.maxPeople}
                          </span>
                        )}
                      </label>
                    );
                  })}
            </div>
          </div>

          <div className={styles.ticket_Box}>
            <div className={styles.section}>구매 매수</div>
            <div className={styles.ticket_Btns}>
              <button className={styles.ticket_Btn} onClick={Minus}>
                -
              </button>
              <span className={styles.ticket_Count}>{count}</span>
              <button className={styles.ticket_Btn} onClick={Plus}>
                +
              </button>
            </div>
            <div className={styles.count_info}>예매가능합니다</div>
          </div>

          <div className={styles.ticket_Box}>
            <div className={styles.section}>총 금액</div>
            <div className={styles.total}>
              {formatPrice((selectedSch?.cost || 0) * count)}원
            </div>

            <div className={styles.ticket_Reser}>
              <button
                className={`${
                  selectedSch ? styles.Reser_Btn : styles.Reser_Btn_dis
                }`}
                onClick={() => {
                  if (isDisable) return;
                  if (!selectedSch) return setSelectSchOpen(true);
                  setOpen(true);
                }}
                disabled={isDisable}
              >
                예매하기
              </button>

              {/* 예매 확인 모달 */}
              <Modal
                className={null}
                isOpen={open}
                onClose={() => setOpen(false)}
              >
                <div className={styles.modal_top}>
                  <p>예매를 진행하시겠어요?</p>
                </div>
                <div className={styles.modal_con}>
                  <span className={styles.modal_strong}>
                    {selectedSch && (
                      <span>
                        {selectedSch.order}공 {formatDate(selectedSch.date)}{" "}
                        {formatTime(selectedSch.time)}
                      </span>
                    )}{" "}
                    {count}매
                  </span>
                </div>
                <div className={styles.modal_con}>
                  예매 정보가 맞는지 확인해주세요.
                </div>
                <div className={styles.modal_Btns}>
                  <button
                    className={styles.modal_close_Btn}
                    onClick={() => setOpen(false)}
                  >
                    취소
                  </button>
                  <button
                    className={styles.modal_reserv_Btn}
                    onClick={handleReser}
                  >
                    예매하기
                  </button>
                </div>
              </Modal>

              {/* 성공 모달 */}
              <Modal
                className={styles.modal_succ_re}
                isOpen={secondModalOpen}
                onClose={() => setSecondModalOpen(false)}
              >
                <div className={styles.modal_top}>
                  <p>예매가 완료되었습니다.</p>
                </div>
                <div className={styles.modal_mid}>
                  <div className={styles.modal_con}>
                    {show && <img src={show.qrImage} alt="QR 코드" />}
                    <div className={styles.modal_con}>
                      <span className={styles.modal_strong_bl}>
                        한동은행 1001 - 1234 - 5678 -90
                      </span>
                      <span>
                        혹은{" "}
                        <span className={styles.modal_strong_bl}>QR 코드</span>
                        로{" "}
                        <span>
                          {formatPrice((selectedSch?.cost || 0) * count)}원
                        </span>{" "}
                        송금해주세요.
                      </span>
                      <span>
                        입금자명은{" "}
                        <span className={styles.modal_strong}>학번+이름</span>
                        으로 해주세요.
                      </span>
                      계좌번호는 마이페이지에서 다시 볼 수 있습니다.
                    </div>
                  </div>
                </div>
                <div className={styles.modal_Btns}>
                  <button
                    className={styles.modal_ok_Btn}
                    onClick={reservConfirm}
                  >
                    확인
                  </button>
                </div>
              </Modal>

              {/* 실패 모달 */}
              <Modal
                className={null}
                isOpen={failModalOpen}
                onClose={() => setFailModalOpen(false)}
              >
                <div className={styles.modal_top}>
                  <p>예매에 실패하였습니다.</p>
                </div>
                <div className={styles.modal_con}>
                  {!token
                    ? "로그인 후 다시 이용해 주세요"
                    : "다시 시도해주세요."}
                </div>
                <div className={styles.modal_Btns}>
                  <button
                    className={styles.modal_ok_Btn}
                    onClick={() => {
                      setFailModalOpen(false);
                      window.scrollTo(0, 0);
                      if (!token) navigate("/login");
                    }}
                  >
                    확인
                  </button>
                </div>
              </Modal>
              {/*구매제한 안내 모달*/}
              <Modal
                className={null}
                isOpen={limitOpen}
                onClose={() => setLimitOpen(false)}
              >
                <div className={styles.modal_con}>
                  인당 {selectedSch?.maxTickets}매까지 구매 가능합니다
                </div>
                <div className={styles.modal_Btns}>
                  <button
                    type="button"
                    ref={limitOkRef}
                    autoFocus
                    className={styles.modal_reserv_Btn}
                    onClick={() => setLimitOpen(false)}
                  >
                    확인
                  </button>
                </div>
              </Modal>
              {/*회차선택 모달*/}
              <Modal
                className={null}
                isOpen={selectSchOpen}
                onClose={() => setSelectSchOpen(false)}
              >
                <div className={styles.modal_con}>
                  공연 회차를 선택해주세요.
                </div>
                <div className={styles.modal_Btns}>
                  <button
                    type="button"
                    ref={selectSchOkRef}
                    autoFocus
                    className={styles.modal_reserv_Btn}
                    onClick={() => setSelectSchOpen(false)}
                  >
                    확인
                  </button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowDetail;
