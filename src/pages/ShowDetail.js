/* eslint-disable */
import React from "react";
import { useState, useEffect } from "react";
import styles from "./styles/ShowDetail.module.css";

import BACK from "../assets/ShowBackButton.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";

function ShowDetail() {
  const { showId } = useParams();
  const [show, setShow] = useState({});
  const [count, setCount] = useState(1);
  const [cost, setCost] = useState(0);
  const [selectedSch, setSelectedSch] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  const [reservation, setReservation] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [failModalOpen, setFailModalOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  const navigateToPrepage = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const fetchData = async () => {
    console.log("받은 showId:", showId, typeof showId); // 디버깅용

    try {
      const response = await axios.get(
        `http://jinjigui.info:8080/show/detail/${showId}`
      );
      console.log("API 응답 데이터:", response.data);
      if (response.data) {
        setShow(response.data);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      console.log("데이터를 불러오는 중 오류가 발생했습니다.");
      setShow(null);
    } finally {
      setLoading(false);
    }
  };

  // 올바른 useEffect 사용
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [showId]);

  const navigateToClubDetail = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  //예매 버튼 API 연결
  const handleReser = async () => {
    console.log("선택된 스케줄 ID: ", selectedSch.scheduleId);
    if (!selectedSch) {
      alert("공연 회차를 선택해주세요.");
      return;
    }
    const requestData = {
      scheduleId: selectedSch.scheduleId,
      wishToPurchaseTickets: count,
    };

    try {
      console.log(requestData);
      console.log("JWT_TOKEN: ", token);
      const response = await axios.post(
        `http://jinjigui.info:8080/show/detail/reservation`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("예매 데이터 보내기 성공: ", response.data);
      reservationData(response.data);
      setOpen(false);
      setSecondModalOpen(true);
    } catch (error) {
      console.log("예매 데이터 보내기 실패: ", error);

      if (error.response) {
        console.error("서버 응답 데이터: ", error.response.data);
      } else {
        console.log("서버 응답이 없습니다. 네트워크를 확인해주세요. ");
      }
      setOpen(false);
      setFailModalOpen(true);
    }
  };

  const reservationData = async (responseData) => {
    try {
      if (responseData.available === true) {
        setIsDisable(true);
      } else {
        console.log("예매 실패!");
      }
    } catch (error) {
      console.error("가져오기 ERROR:", error);
    }
  };

  const reservConfirm = async () => {
    setSecondModalOpen(false);
    window.location.reload();
  };

  const formatPrice = (price) => {
    return price.toLocaleString("ko-KR");
  };

  useEffect(() => {
    setCount(1);
  }, [selectedSch]);

  const Minus = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const Plus = () => {
    if (selectedSch) {
      const maxAvailable = Math.min(
        selectedSch.maxPeople - selectedSch.applyPeople,
        selectedSch.maxTickets
      );
      if (count < maxAvailable) {
        setCount(count + 1);
      } else if (count == selectedSch.maxTickets) {
        alert(`인당 최대 ${selectedSch.maxTickets}매까지 예매가능합니다.`);
      } else {
        alert(`현재 ${count}매를 예매할 수 있습니다.`);
      }
    } else {
      alert("공연 회차를 선택해주세요.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return dateString;

    if (dateString.includes("-")) {
      const dateParts = dateString.split("-");
      if (dateParts.length >= 2) {
        return `${dateParts[1]}월${dateParts[2]}일`;
      }
    }
    return dateString;
  };

  const formatTime = (timeString) => {
    if (!timeString) return timeString;

    if (timeString.includes(":")) {
      const timeParts = timeString.split(":");
      if (timeParts.length >= 2) {
        return `${timeParts[0]}시${timeParts[1]}분`;
      }
    }
    return timeString;
  };
  return timeString;
}

// 로딩 상태
if (loading) {
  return (
    <div className={styles.wrap}>
      <div>로딩 중...</div>
    </div>
  );
}

// 에러 상태
if (error) {
  return (
    <div className={styles.wrap}>
      <div className={styles.back_Div}>
        <button className={styles.back_Btn} onClick={navigateToPrepage}>
          <img src={BACK} className={styles.move_Back} alt="back" />
        </button>
      </div>
      <div>오류: {error}</div>
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
                src={show.photo}
                className={styles.show_Pic}
                alt="show_IMG"
              />
            )}
            <div className={styles.show_Info}>
              <div className={styles.title}>
                {show?.showName || "타이틀 정보 없음"}
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
                    {show?.introductionLetter || "소개글 정보 없음"}
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
                    {show?.startDate || "시작 날짜 정보 없음"} -
                    {show?.endDate || "끝 날짜 정보 없음"}
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>러닝타임</span>
                  </span>
                  <span className={styles.variable_Info}>
                    {show?.runtime || "러닝타임 정보 없음"}분
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>담당자</span>
                  </span>
                  <span className={styles.variable_Info}>
                    {show?.managerInfo || "담당자 정보 없음"}
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
                .filter((sch) => sch != null) // null/undefined 제거
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
                      {sch.order}공: {sch.date} {sch?.time || "시간 정보 없음"}{" "}
                      | {formatPrice(sch.cost)}원 |{" "}
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
          <div className={styles.count_info}>
            *한 회차 당 최대 <span>{selectedSch.maxTickets}</span>매까지
            예매가능합니다
          </div>
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
                if (isDisable) {
                  return;
                } // 클릭 무시
                setOpen(true);
              }}
              disabled={isDisable}
            >
              예매하기
            </button>
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
                  {show && <img src={show.qrImage} alt="QR 코드"></img>}
                  <div className={styles.modal_con}>
                    <span className={styles.modal_strong_bl}>
                      한동은행 1001 - 1234 - 5678 -90
                    </span>
                    <span>
                      혹은{" "}
                      <span className={styles.modal_strong_bl}>QR 코드</span>로{" "}
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
                <button className={styles.modal_ok_Btn} onClick={reservConfirm}>
                  확인
                </button>
              </div>
            </Modal>
            <Modal
              className={null}
              isOpen={failModalOpen}
              onClose={() => setFailModalOpen(false)}
            >
              <div className={styles.modal_top}>
                <p>예매에 실패하였습니다.</p>
              </div>
              <div className={styles.modal_con}>
                {token === null ? "로그인 후 다시 이용해 주세요" : ""}
              </div>
              <div className={styles.modal_Btns}>
                {" "}
                <button
                  className={styles.modal_ok_Btn}
                  onClick={() => {
                    setFailModalOpen(false);
                    window.location.reload();
                  }}
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

export default ShowDetail;
