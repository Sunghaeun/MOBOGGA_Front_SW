import React, { useState, useEffect, useRef } from "react";
import styles from "./styles/ShowDetail.module.css";
import loadingStyles from "../styles/Loading.module.css";
import useAuthStore from "../stores/authStore";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../utils/apiClient";
import Modal from "../components/Modal";
import BACK from "../assets/ShowBackButton.svg";
import ShowDetailMobile from "../components/ShowDetail/ShowDetailMobile";
import Seats from "../components/Seat/Seats";

function ShowDetail() {
  const { showId } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { user, isLoggedIn, token, authLoading } = useAuthStore();

  const [show, setShow] = useState({});
  const [countBySch, setCountBySch] = useState({});
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
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const navigateToPrepage = () => navigate(-1);

  // 상세 데이터 불러오기
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const _res = await apiClient.get(`/show/detail/${showId}`);
      setShow(_res.data || {});
      console.log(_res.data);
      setError(null);
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

    const requestData = {
      scheduleId: selectedSch.scheduleId,
      wishToPurchaseTickets: countBySch[selectedSch.scheduleId] || 0,
      wishSeats: selectedIds,
    };

    console.log(requestData);


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

  const Minus = () => {
     if (!selectedSch) return;
        const id = selectedSch.scheduleId;
        const current = countBySch[id] || 0;

  setCountBySch((prev) => ({
    ...prev,
    [id]: Math.max(current - 1, 1),
  }));
  };
  const Plus = () => {
    if (!selectedSch) return setSelectSchOpen(true);
    const id = selectedSch.scheduleId;
  const current = countBySch[id] || 0;
    const maxAvailable = Math.min(
      selectedSch.maxPeople - selectedSch.applyPeople,
      selectedSch.maxTickets
    );
    if (current < maxAvailable) {
    setCountBySch((prev) => ({
      ...prev,
      [id]: current + 1,
    }));
  } else if (current === selectedSch.maxTickets) {
    setLimitOpen(true);
  } else {
    alert(`현재 ${current}매를 예매할 수 있습니다.`);
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return dateString;
    const parts = dateString.split("-");
    return parts.length >= 3 ? `${parts[0]}.${parts[1]}.${parts[2]}` : dateString;
    // YYYY-MM-DD 가정
  };

  const formatTime = (timeString) => {
    if (!timeString) return timeString;
    const parts = timeString.split(":");
    return parts.length >= 2 ? `${parts[0]}시${parts[1]}분` : timeString;
  };
//요일 구하는 함수
  const getDayOfWeek = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date)) return "";

  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
};

  // ✅ 회차 변경 시 count 초기화
const handleSelectSch = (scheduleId) => {
  const sch = show?.scheduleList.find((s) => s?.scheduleId === scheduleId);
  setSelectedSch(sch);
  setSelectedShowId(scheduleId); // 추가
  setCountBySch((prev) => {
    const updated = { ...prev };

    // 모든 회차 count 0으로 초기화
    Object.keys(updated).forEach((id) => {
      updated[id] = 0;
    });

    // 새로 선택된 회차 count를 1로 설정
    updated[scheduleId] = 1;

    return updated;
  });
};

  // 텍스트에 URL이 포함되어 있으면 하이퍼링크로 변환하고, 줄바꿈을 처리하는 함수
  const renderWithLinksAndLineBreaks = (text) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)(?=\s|$|[.,!?;:])/g;
    const lines = text.split("\n");
    const processedLines = lines.map((line) => {
      const withLinks = line.replace(urlRegex, (match) => {
        const url = match.replace(/[.,!?;:]$/, "");
        const href = url.startsWith("http") ? url : `https://${url}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      });
      return withLinks;
    });
    return (
      <div>
        {processedLines.map((line, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </div>
    );
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
              로그인하러 가기
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.desktop}>
        <div className={styles.show_con}>
          <div className={styles.show_Intro}>
            <div className={styles.intro_Info}>
              <div className={styles.show_Top}>
                <span className={styles.back_Div}>
                  <button
                    className={styles.back_Btn}
                    onClick={navigateToPrepage}
                  >
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
                    {show?.clubName
                      ? `${show?.clubName} >`
                      : "동아리 정보 없음"}
                  </div>

                  <div className={styles.infos}>
                    <div className={styles.info_Box}>
                      <span className={styles.fixed_Info}>
                        <span className={styles.info_txt}>소개글</span>
                      </span>
                      <span className={styles.variable_Info}>
                        {renderWithLinksAndLineBreaks(
                          show?.introductionLetter ||
                            show?.intro ||
                            "소개글 정보 없음"
                        )}
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
                        {formatDate(show?.startDate) || "시작 날짜 정보 없음"} -{" "}
                        {formatDate(show?.endDate) || "끝 날짜 정보 없음"}
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
                        {renderWithLinksAndLineBreaks(
                          show?.noticeLetter || "공지 정보 없음"
                        )}
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
              <div className={styles.count_info}>*한 회차 당 최대 {selectedSch?.maxTickets}매까지 예매 가능합니다</div>
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
                            onChange={() => handleSelectSch(sch.scheduleId)}
                            checked={selectedShowId === sch.scheduleId}
                          />
                          <div className={styles.order}>{sch.order}공</div>
                          <div className={styles.sch_info}>
                              <span id={styles.time}>{formatDate(sch.date)}({getDayOfWeek(sch.date)}) {" "}{formatTime(sch?.time) || "시간 정보 없음"}</span>
                            <div id={styles.sch_mid}>{formatPrice(sch.cost)}원  |{"  "}
                              {isFull ? (
                                <span className={styles.disabled_Label}>매진</span>
                              ) : (
                                <span className={styles.people_Count}>
                                  {" "}
                                  {sch.applyPeople}/{sch.maxPeople}
                                </span>
                              )}</div>
                            <div className={styles.ticket_Btns}>
                              <button className={styles.ticket_Btn} onClick={Minus}>
                                -
                              </button>
                              <span className={styles.ticket_Count}>{countBySch[sch.scheduleId] || 0}</span>
                              <button className={styles.ticket_Btn} onClick={Plus}>
                                +
                              </button>
                            </div>
                          </div>
                        </label>
                      );
                    })}
              </div>
            </div>
          </div>

          <div className={styles.show_row}>

            <Seats
              seatTicket={show.scheduleList?.find(s => s.scheduleId === selectedShowId)?.seatTicket || []}
              onSelectedSeatsChange={(selectedIds) => {
                setSelectedIds(selectedIds);
                console.log("선택된 좌석 인덱스 번호:", selectedIds);
              }}
            />
            <div className={styles.ticket_Box}>
              <div className={styles.section}>총 금액</div>
              <div className={styles.total}>
                {formatPrice((selectedSch?.cost || 0) * (countBySch[selectedSch?.scheduleId] || 0))}원
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
                      {countBySch[selectedSch?.scheduleId]}매
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
                          <span className={styles.modal_strong_bl}>
                            QR 코드
                          </span>
                          로{" "}
                          <span>
                            {formatPrice((selectedSch?.cost || 0) * countBySch[selectedSch?.scheduleId])}원
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
      <div className={styles.mobile}>
        <ShowDetailMobile
          show={show}
          navigateToClubDetail={navigateToClubDetail}
          isPastShow={isPastShow}
          selectedSch={selectedSch}
          setSelectedSch={setSelectedSch}
          count={countBySch[selectedSch?.scheduleId]}
          setCount={countBySch}
          isDisable={isDisable}
          setOpen={setOpen}
          setSelectSchOpen={setSelectSchOpen}
          setLimitOpen={setLimitOpen}
          Plus={Plus}
          Minus={Minus}
          navigateToPrepage={navigateToPrepage}
        />
      </div>
    </div>
  );
}

export default ShowDetail;
