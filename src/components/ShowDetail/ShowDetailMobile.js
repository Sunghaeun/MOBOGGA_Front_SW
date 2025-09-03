import React, { useState, useEffect, useRef } from "react";
import styles from "./ShowDetailMobile.module.css";
import loadingStyles from "../../styles/Loading.module.css";
import useAuthStore from "../../stores/authStore";
import BACK from "../../assets/ShowBackButton.svg";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import MobileModal from "../../components/MobileModal";

function ShowDetailMobile() {
  const { showId } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { user, isLoggedIn, token, authLoading } = useAuthStore();

  const [show, setShow] = useState({});
  const [counts, setCounts] = useState({});
  // eslint-disable-next-line
  const [selectedSch, setSelectedSch] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeSection, setIsActiveSection] = useState("info");

  const [switchOpen, setSwitchOpen] = useState(false);
  const [pendingSch, setPendingSch] = useState(null);

  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [failModalOpen, setFailModalOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);
  const limitOkRef = useRef(null);
  // eslint-disable-next-line
  const selectSchOkRef = useRef(null);

  const navigateToPrepage = () => navigate(-1);

  // 상세 데이터 불러오기
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const _res = await apiClient.get(`/show/detail/${showId}`);
      setShow(_res.data || {});
      setError(null);
      console.log(_res);
    } catch (err) {
      // fetch error handled below

      if (err.response?.status === 401) {
        setError(
          "로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요."
        );
      } else if (err.response?.status === 403) {
        setError("이 공연에 접근할 권한이 없습니다.");
      } else if (err.response?.status === 404) {
        setError("요청하신 공연을 찾을 수 없습니다.");
      } else {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      }
      setShow(null);
    } finally {
      setLoading(false);
    }
  };

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
    if (!switchOpen) return;
    const onKey = (e) => {
      if (e.isComposing) return;
      if (e.key === "Enter") {
        e.preventDefault();
        selectSchOkRef.current?.click();
      }
      if (e.key === "Escape") setSwitchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [switchOpen]);

  useEffect(() => {
    if (authLoading) {
      // 인증 로딩 중이면 대기
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId, authLoading]);

  const navigateToClubDetail = (clubId) => navigate(`/clubs/${clubId}`);

  // 예매 버튼 API
  const handleReser = async () => {
    if (!selectedSch) {
      alert("공연 회차를 선택해주세요.");
      return;
    }

    if (!isLoggedIn) {
      setOpen(false);
      setFailModalOpen(true);
      return;
    }
    const selectedCount = getCounts(selectedSch);
    if (selectedCount <= 0) {
      alert("1매 이상 선택해주세요.");
      return;
    }

    const requestData = {
      scheduleId: selectedSch.scheduleId,
      wishToPurchaseTickets: getCounts(selectedSch),
    };

    try {
      await apiClient.post("/show/detail/reservation", requestData);

      setOpen(false);
      setSecondModalOpen(true);
      setIsDisable(true);
    } catch (err) {
      // reservation failed -- show fail modal
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

  const Minus = (sch) => {
    if (!sch) return;
    const cur = getCounts(sch);
    if (cur > 0) setCountFor(sch, cur - 1);
  };
  const Plus = (sch) => {
    if (!sch) return;

    const key = schKey(sch);
    const activeKey = Object.keys(counts).find((k) => counts[k] > 0);
    if (activeKey && activeKey !== key) {
      setPendingSch(sch);
      setSwitchOpen(true);
      return; // 증가하지 않음
    }
    const cur = getCounts(sch);
    const avail = Math.max(
      0,
      Math.min(
        (sch?.maxPeople ?? 0) - (sch?.applyPeople ?? 0),
        sch?.maxTickets ?? Infinity
      )
    );
    if (cur < avail) setCountFor(sch, cur + 1);
    else if (cur === (sch?.maxTickets ?? 0)) setLimitOpen(true);
    else alert(`현재 ${cur}매를 예매할 수 있습니다.`);
  };

  const schKey = (sch) =>
    sch?.scheduleId ??
    `${sch?.date ?? "d"}_${sch?.time ?? "t"}_${sch?.order ?? "o"}`;

  const getCounts = (sch) => (sch ? counts[schKey(sch)] ?? 0 : 0);
  const setCountFor = (sch, next) =>
    setCounts({ [schKey(sch)]: Math.max(0, next) });

  const formatDate = (dateString) => {
    if (!dateString) return dateString;
    const parts = dateString.split("-");
    return parts.length >= 3
      ? `${parts[0]}.${parts[1]}.${parts[2]}`
      : dateString;
    // YYYY-MM-DD 가정
  };
  const formatTime = (timeString) => {
    if (!timeString) return timeString;
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}시${parts[1]}분` : timeString;
  };

  // 공연이 과거인지 판별 (endDate가 있으면 endDate 기준, 없으면 스케줄의 모든 날짜가 과거인지 확인)
  const isPastShow = () => {
    try {
      const now = new Date();
      if (show?.endDate) {
        const end = new Date(show.endDate);
        // endDate가 YYYY-MM-DD일 경우, 당일은 공연 있음으로 간주하기 위해 하루 끝까지 포함
        end.setHours(23, 59, 59, 999);
        return end < now;
      }
      if (Array.isArray(show?.scheduleList) && show.scheduleList.length > 0) {
        return show.scheduleList.every((s) => {
          if (!s?.date) return false;
          const d = new Date(s.date);
          d.setHours(23, 59, 59, 999);
          return d < now;
        });
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // 로딩
  if (authLoading || loading) {
    return (
      <div className={loadingStyles.loading}>
        <div className={loadingStyles.loadingSpinner}></div>
        <div className={loadingStyles.loadingText}>
          {authLoading ? "인증 상태 확인 중" : "공연 정보를 불러오고 있습니다"}
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
            다시 시도
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
      <div className={styles.show_con}>
        <div className={styles.show_Intro}>
          <div className={styles.intro_Info}>
            <div className={styles.show_Top}>
              <span className={styles.back_Div}>
                <button className={styles.back_Btn} onClick={navigateToPrepage}>
                  <img src={BACK} className={styles.move_Back} alt="back" />
                </button>
              </span>
              공연정보
            </div>
            <div className={styles.intro_con}>
              {show && (
                <div className={styles.picDiv}>
                  <img
                    src={show.photo || show.poster || show.posterUrl}
                    className={styles.show_Pic}
                    alt="show_IMG"
                  />
                </div>
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

                <div className={styles.shortInfo}>
                  기간: {show?.startDate} - {show?.endDate} | 장소:{" "}
                  {show?.location} | 러닝타임 : {show?.runtime}분
                </div>
                <div className={styles.sectionBtns}>
                  <button
                    type="button"
                    className={`${styles.sectionL} ${
                      activeSection === "info" ? styles.sectionActive : ""
                    }`}
                    onClick={() => setIsActiveSection("info")}
                  >
                    공연 정보
                  </button>{" "}
                  <button
                    type="button"
                    className={`${styles.sectionR}
                ${activeSection === "ticket" ? styles.sectionActive : ""}
                ${isPastShow() ? styles.sectionDisabled : ""}`}
                    onClick={() => {
                      setIsActiveSection("ticket");
                    }}
                    aria-disabled={isPastShow()}
                  >
                    티켓 예매
                  </button>{" "}
                </div>

                {activeSection === "info" && (
                  <div className={styles.infos}>
                    <div className={styles.info_Box}>
                      <div className={styles.fixed_Info}>소개글</div>
                      <div className={styles.variable_Info}>
                        {show?.introductionLetter ||
                          show?.intro ||
                          "소개글 정보 없음"}
                      </div>
                    </div>

                    <div className={styles.info_Box}>
                      <div className={styles.fixed_Info}>장소</div>
                      <div className={styles.variable_Info}>
                        {show?.location || "장소 정보 없음"}
                      </div>
                    </div>

                    <div className={styles.info_Box}>
                      <div className={styles.fixed_Info}>날짜</div>
                      <div className={styles.variable_Info}>
                        {show?.startDate || "시작 날짜 정보 없음"} -{" "}
                        {show?.endDate || "끝 날짜 정보 없음"}
                      </div>
                    </div>

                    <div className={styles.info_Box}>
                      <div className={styles.fixed_Info}>러닝타임</div>
                      <div className={styles.variable_Info}>
                        {show?.runtime != null
                          ? show.runtime
                          : "러닝타임 정보 없음"}
                        {show?.runtime != null ? "분" : ""}
                      </div>
                    </div>

                    <div className={styles.info_Box}>
                      <div className={styles.fixed_Info}>담당자</div>
                      <div className={styles.variable_Info}>
                        {show?.managerPhoneNumber || "담당자 정보 없음"} {" ("}
                        {show?.manager || " "}
                        {") "}
                      </div>
                    </div>

                    <div className={styles.info_Box}>
                      <div className={styles.fixed_Info}>공지</div>
                      <div className={styles.variable_Info}>
                        {show?.noticeLetter || "공지 정보 없음"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {
          activeSection === "ticket" && (
            //   (isPastShow() ? (
            //     <div className={styles.ticket_ended}>이 공연은 종료되었습니다.</div>
            //   ) : (
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
                            className={`${styles.sch_Item} 
                      ${isFull ? styles.disabled_Label : ""} 
                      ${
                        selectedSch?.scheduleId === sch.scheduleId
                          ? styles.selected_Label
                          : ""
                      }`}
                            key={schKey(sch)}
                            onClick={() => {
                              setSelectedSch(sch);
                              setCounts((prev) => ({
                                [schKey(sch)]: prev[schKey(sch)] ?? 0,
                              }));
                            }}
                          >
                            <div className={styles.Item_left}>
                              {sch.order}공
                            </div>
                            <div className={styles.Item_right}>
                              <div className={styles.ItemDate}>
                                {formatDate(sch.date)}{" "}
                                {formatTime(sch?.time) || "시간 정보 없음"}
                              </div>
                              <div className={styles.ItemMid}>
                                {formatPrice(sch.cost)}원 |{" "}
                                <span className={styles.people_Count}>
                                  {sch.applyPeople}/{sch.maxPeople}
                                </span>
                              </div>
                              {isFull ? (
                                <span className={styles.disabled_txt}>
                                  매진
                                </span>
                              ) : (
                                <div className={styles.ticket_Btns}>
                                  <button
                                    className={styles.ticket_Btn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedSch(sch);
                                      Minus(sch);
                                    }}
                                  >
                                    -
                                  </button>
                                  <span className={styles.ticket_Count}>
                                    {getCounts(sch)}
                                  </span>
                                  <button
                                    className={styles.ticket_Btn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedSch(sch);
                                      Plus(sch);
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                </div>
              </div>

              {/* 예매 확인 모달 */}
              <MobileModal
                className={null}
                isOpen={open}
                onClose={() => setOpen(false)}
              >
                <div className={styles.modal_top}>
                  <p>예매를 진행하시겠어요?</p>
                </div>
                <div className={styles.modal_con}>
                  <span>
                    <span className={styles.modal_strong}>
                      {selectedSch && (
                        <span>
                          {selectedSch.order}공 {formatDate(selectedSch.date)}{" "}
                          {formatTime(selectedSch.time)}
                        </span>
                      )}{" "}
                      {getCounts(selectedSch)}매
                    </span>
                    가 맞는지
                  </span>
                </div>
                <div className={styles.modal_con}>다시 한 번 확인해주세요.</div>
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
                    확인
                  </button>
                </div>
              </MobileModal>

              {/* 성공 모달 */}
              <MobileModal
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
                        <span className={styles.modal_strong_bl}>QR 코드</span>{" "}
                        로{" "}
                        <span>
                          {formatPrice(
                            (selectedSch?.cost || 0) * getCounts(selectedSch)
                          )}
                          원
                        </span>{" "}
                        송금해주세요.
                      </span>
                      <span>
                        입금자명은{" "}
                        <span className={styles.modal_strong}>학번+이름</span>{" "}
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
              </MobileModal>

              {/* 실패 모달 */}
              <MobileModal
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
              </MobileModal>

              {/* 구매제한 안내 모달 */}
              <MobileModal
                className={styles.limitModal}
                isOpen={limitOpen}
                onClose={() => setLimitOpen(false)}
              >
                <div className={styles.modal_top}>
                  <div>최대 {selectedSch?.maxTickets}매까지</div>{" "}
                  <div>예매가능합니다.</div>
                </div>
                <div className={styles.modal_Btns}>
                  <button
                    type="button"
                    ref={limitOkRef}
                    autoFocus
                    className={styles.modal_close_Btn}
                    onClick={() => setLimitOpen(false)}
                  >
                    확인
                  </button>
                </div>
              </MobileModal>
              {/* 회차 전환 확인 모달 */}
              <MobileModal
                className={null}
                isOpen={switchOpen}
                onClose={() => setSwitchOpen(false)}
              >
                <div className={styles.modal_top}>
                  <p>이미 다른 회차에 수량이 담겨 있어요</p>
                </div>
                <div className={styles.modal_con}>
                  한 번에 하나의 회차만 예매할 수 있습니다.
                  <br />이 회차로 변경하시겠어요?
                </div>
                <div className={styles.modal_Btns}>
                  <button
                    className={styles.modal_close_Btn}
                    onClick={() => setSwitchOpen(false)}
                  >
                    취소
                  </button>
                  <button
                    ref={selectSchOkRef}
                    className={styles.modal_reserv_Btn}
                    onClick={() => {
                      if (!pendingSch) return;
                      // 선택 회차를 pendingSch로 전환하고, 수량은 "1"부터 시작(요청하신 동작: +를 눌렀으므로)
                      setSelectedSch(pendingSch);
                      setCounts({ [schKey(pendingSch)]: 1 });
                      setPendingSch(null);
                      setSwitchOpen(false);
                    }}
                  >
                    변경
                  </button>
                </div>
              </MobileModal>
            </div>
          )
          //   ))
        }
        {/* {selectedSch && count > 0 && ( */}
        <div className={styles.stickyBar}>
          <div className={styles.stickyTop}>
            <div className={styles.stickyLeft}>
              <span className={styles.stickyCount}>
                총 {getCounts(selectedSch)}매
              </span>
            </div>
            <div className={styles.stickyRight}>
              <span className={styles.stickyTotal}>
                {formatPrice((selectedSch?.cost || 0) * getCounts(selectedSch))}{" "}
                원
              </span>
            </div>
          </div>
          <button
            type="button"
            className={styles.stickyReserveBtn}
            onClick={() => {
              if (isDisable) return;
              setOpen(true);
            }}
            disabled={isDisable}
          >
            예매하기
          </button>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}

export default ShowDetailMobile;
