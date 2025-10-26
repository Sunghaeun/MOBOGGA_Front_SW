import { useNavigate } from "react-router-dom";
import React, { useState , useEffect} from "react";
import styles from "./styles/CreateShow.module.css";
import DELETE from "../assets/button_delete.svg";
import PLACE from "../assets/popover_place.svg";
import useAuthStore from "../stores/authStore";
import apiClient from "../utils/apiClient";
import POSTER from "../assets/poster.png";
import Dropdown from "../components/Dropdown";
import NotReservationSeatModal from "../components/Seat/NotReservationSeatModal";

function CreateShow() {
  const navigate = useNavigate();
  const { isLoggedIn, isManager } = useAuthStore();

  const [name, setName] = useState("");
  const [poster, setPoster] = useState(null);
  const [qr, setQr] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  // eslint-disable-next-line
  const [location, setLocation] = useState("");
  // eslint-disable-next-line
  const [startDate, setStartDate] = useState("");
  // eslint-disable-next-line
  const [endDate, setEndDate] = useState("");
  const [runtime, setRunTime] = useState("");
  const [managerPhoneNumber, setManagerPhoneNumber] = useState("");
  const [manager, setManager] = useState("");
  const [seatReservationEnabled, setSeatReservationEnabled] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState("");
  // eslint-disable-next-line
  const [maxPeople, setMaxPeople] = useState(100);

  const [accountNumber, setAccountNumber] = useState("");
  const [accouuntName, setAccountName] = useState(""); // 기존 변수명 유지 (오타 포함)
  const [accountBankName, setAccountBankName] = useState("");
  const [introductionLetter, setIntroductionLetter] = useState("");
  const [noticeLetter, setNoticeLetter] = useState("");
  const [earlyBird, setEarlyBird] = useState(false);

  // eslint-disable-next-line
  const [maxTickets, setMaxTickets] = useState("");
  // eslint-disable-next-line
  const [previewURL, setPreviewURL] = useState(null);

  // const Minus = () => {
  //   if (count > 1) setCount(count - 1);
  // };
  // const Plus = () => {
  //   if (count) setCount(count + 1);
  // };

  // 회차 배열
  const [shows, setShows] = useState([
    {
      id: Date.now(),
      order: 1,
      date: "",
      hour: "",
      minute: "00",
      cost: "",
      maxTicket: 1,
      maxPeople: 100,
      seatTicket: [],
    },
  ]);

  // 회차 업데이트
  const updateSchedule = (id, key, value) => {
    setShows((prevShows) =>
      prevShows.map((show, index) =>
        show.id === id ? { ...show, [key]: value, order: index + 1 } : show
      )
    );
  };

  const incMaxTicket = (rowId) => {
    setShows((prev) =>
      prev.map((s) =>
        s.id === rowId ? { ...s, maxTicket: (Number(s.maxTicket) || 0) + 1 } : s
      )
    );
  };
  const decMaxTicket = (rowId) => {
    setShows((prev) =>
      prev.map((s) =>
        s.id === rowId
          ? { ...s, maxTicket: Math.max(0, (Number(s.maxTicket) || 0) - 1) }
          : s
      )
    );
  };

  /* 사진 미리보기 */
  const handlePosterChange = (e) => {
    const file = e.target.files?.[0] || null;

    // 이전 blob url 정리
    if (posterPreview?.startsWith("blob:")) URL.revokeObjectURL(posterPreview);

    setPoster(file);
    setPosterPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleQrChange = (e) => {
    const file = e.target.files?.[0] || null;

    setQr(file);
    setQrPreview(file ? URL.createObjectURL(file) : null);
  };

  const makeShow = async () => {
    // 0) 필수값 검증
    if (!isLoggedIn || !isManager()) {
      alert("로그인이 필요하거나 권한이 없습니다.");
      navigate("/login");
      return;
    }

    if (!name) return alert("제목을 입력해 주세요");
    if (!poster || !(poster instanceof File))
      return alert("공연 이미지를 선택해 주세요");

    if (!location) return alert("장소를 입력해 주세요");
    if (!runtime || Number(runtime) <= 0)
      return alert("런타임을 입력해 주세요");

    for (let i = 0; i < shows.length; i++) {
      if (!shows[i].date) return alert(`${i + 1}공의 날짜를 입력해 주세요`);
      if (!shows[i].hour || !shows[i].minute)
        return alert(`${i + 1}공의 시작시간(시/분)을 모두 선택해 주세요`);
      if (!shows[i].cost || Number(shows[i].cost) <= 0)
        return alert(`${i + 1}공의 가격을 입력해 주세요`);
    }

    // 1) 시간 HH:mm -> HH:mm:ss
    const toHmsFromHM = (h, m) => {
      const pad = (x) =>
        x === "" || x == null ? "" : String(x).padStart(2, "0");
      const hh = pad(h);
      const mm = pad(m);
      return hh && mm ? `${hh}:${mm}:00` : "";
    };

    // 2) 서버 DTO (ShowCreateRequest)
    const requestData = {
      name,
      location,
      startDate,
      endDate,
      runtime: Number(runtime),
      manager,
      seatReservationEnabled,
      managerPhoneNumber,
      maxPeople,
      accountNumber,
      accountName: accouuntName, // 키는 정상(accountName), 상태변수명은 그대로
      accountBankName,
      introductionLetter,
      noticeLetter,
      earlyBird: Boolean(earlyBird),
      scheduleDtoList: shows.map((s, i) => ({
        id: Number(s.order) || i + 1,
        orderIndex: Number(s.order) || i + 1,
        date: s.date,
        time: toHmsFromHM(s.hour, s.minute),
        cost: Number(s.cost),
        maxTicket: Number(s.maxTicket) || 0,
        maxPeople: Number(s.maxPeople) || 100,
        seatTicket: s.seatTicket,
      })),
    };

    // 3) FormData (파트명 정확히: poster / request / qr)
    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );
    formData.append("poster", poster, "poster.jpg");
if (qr instanceof File) {
  formData.append("qr", qr,"qr.jpg");
}else {
  // 빈 Blob 객체를 전송 (서버에서 파일 필드를 기대할 때 사용)
  formData.append("qr", new Blob([]), "");
}


    // Debug info removed: requestData and FormData remain unchanged.
    try {
      const resp = await apiClient.post("/manager/show/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      // 저장 성공: resp.data 사용
      const { publicId, showId, id } = resp.data || {};
      const detailId = publicId ?? showId ?? id;
      if (detailId) {
        navigate(`/show/${detailId}`);
      } else {
        navigate("/main");
        window.scrollTo(0, 0);
      }
    } catch (error) {
      // 에러는 사용자에게 알림
      alert(
        `저장 실패: ${
          error.response?.data?.message || error.message || "알 수 없는 오류"
        }`
      );
    }
    // console.log("최종 requestData:", requestData);
  };

  const handlename = (e) => {
    if (e.target.value.length <= 30) setName(e.target.value);
    else alert("30글자를 초과할 수 없습니다.");
  };

  const handleIntro = (e) => {
    if (e.target.value.length <= 100) setIntroductionLetter(e.target.value);
    else alert("100자를 초과할 수 없습니다.");
  };

  const handleNotice = (e) => {
    if (e.target.value.length <= 700) setNoticeLetter(e.target.value);
    else alert("700자를 초과할 수 없습니다.");
  };

  const handleAddRow = () => {
    setShows((prev) => {
      const next = [
        ...prev,
        {
          id: Date.now(),
          order: prev.length + 1,
          date: "",
          hour: "",
          minute: "00",
          cost: "",
          maxTicket: 1,
          maxPeople: 100,
          seatTicket: [],
        },
      ];
      // 혹시 모를 불일치 방지용 reindex
      return next.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  const handleRemoveRow = (id) => {
    setShows((prev) =>
      prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 }))
    );
  };
  const [notReservationSeatModalOpen, setNotReservationSeatModalOpen] = useState(false);

  //몇번째 회차인지 기억하는 id
  const [selectedShowId, setSelectedShowId] = useState(null);

  // 예약 불가 좌석 지정 모달
  const openNotReservationSeatModal = (showId) => {
    setSelectedShowId(showId);
    setNotReservationSeatModalOpen(true);
  };

  const closeNotReservationSeatModal = () => {
    setNotReservationSeatModalOpen(false);
    document.body.style.removeProperty("overflow");
  };


  const handleConfirmFromModal = (ids) => {
    if (selectedShowId == null) return;
      setShows((prev) =>
        prev.map((s) =>
          s.id === selectedShowId ? { ...s, seatTicket: ids } : s
        )
      );
    setNotReservationSeatModalOpen(false);
    setSeatReservationEnabled(true);
    setSelectedShowId(null);
    document.body.style.removeProperty("overflow");
  };

  useEffect(() => {
    setLocation(selectedPlace);
  }, [selectedPlace]);

  return (
    <>
    <div>
      <div className={styles.CreateBody}>
        <div className={styles.headText}>공연 새로 만들기</div>
        <div className={styles.Create_Container}>
          <div className={styles.Detail_Entire_Box}>
            <div className={styles.SImage_Box_Entire}>
              <div className={styles.SImage_Box}>
                <img src={posterPreview ?? POSTER} alt="미리보기" />
              </div>
              <label className={styles.inputFileLabel} htmlFor="inputFile">
                이미지 추가
                <input
                  className={styles.inputFile}
                  type="file"
                  id="inputFile"
                  accept="image/*"
                  onChange={handlePosterChange}
                />
              </label>
            </div>

            <div className={styles.entir_Boxs}>
              <div className={styles.smallInfo} style={{ color: "#D50024" }}>
                *송금QR외 모든 정보는 필수입력사항입니다.
              </div>
              <div className={styles.infos}>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>공연이름</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="text"
                      placeholder="공연 이름(공백포함 최대 30자까지 작성 가능합니다.)"
                      value={name}
                      onChange={handlename}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>소개글</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <textarea
                      type="text"
                      placeholder={`공연에 대한 간략한 소개\n(공백포함 최대 100자까지 작성 가능합니다.)`}
                      onChange={handleIntro}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>날짜</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div
                      className={styles.form_detail_date_2}
                      style={{ display: "flex" }}
                    >
                      <input
                        id={styles.form_detail_date}
                        type="date"
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      {"     "}~{"     "}
                      <input
                        id={styles.form_detail_date}
                        type="date"
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </span>
                </div>
                <div className={styles.smallInfo}>
                  *하루만 진행할 경우 같은 날짜로 선택해주세요
                </div>
                
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>장소 <img src={PLACE} alt="icon" style={{width: 18}}/></span>
                  </span>
                  <span
                    className={styles.variable_Info}
                    style={{
                      display: "inline-flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <label className={styles.radio}>
                      <input
                        type="radio"
                        name="place"
                        value="학관 104호"
                        checked={selectedPlace === "학관 104호"}
                        onChange={() => {
                          setSelectedPlace("학관 104호");
                          setSeatReservationEnabled(true);
                        }}
                        className={styles.radioInput}
                      />
                      학관 104호
                    </label>
                    <label
                      className={styles.radio}
                      style={{ marginLeft: "1rem" }}
                    >
                      <input
                        type="radio"
                        name="place"
                        value="올네이션스홀"
                        checked={selectedPlace === "올네이션스홀"}
                        onChange={() => {setSelectedPlace("올네이션스홀");
                          setSeatReservationEnabled(false);
                        }}
                      />
                      올네이션스홀
                    </label>
                    <label
                      className={styles.radio}
                      style={{ marginLeft: "1rem" }}
                    >
                      <input
                        type="radio"
                        name="place"
                        value="그레이스홀"
                        checked={selectedPlace === "그레이스홀"}
                        onChange={() => {setSelectedPlace("그레이스홀");
                          setSeatReservationEnabled(false);
                        }}
                      />
                      그레이스홀
                    </label>
                    <label
                      className={styles.radio}
                      style={{ marginLeft: "1rem" }}
                    >
                      <input
                        type="radio"
                        name="place"
                        value="기타"
                        checked={selectedPlace === "기타"}
                        onChange={() => {setSelectedPlace("기타");
                          setSeatReservationEnabled(false);
                        }}
                      />
                      기타
                    </label>
                  </span>
                </div>
                {selectedPlace === "학관 104호" && (
  <div className={styles.info_Box}style={{marginTop: -20}}>
    <span className={styles.fixed_Info}>
    </span>
    <span
      className={styles.variable_Info}
      style={{
        display: "inline-flex",
        justifyContent: "left",
        alignItems: "center",
        color: "#FF3D12"
      }}
    >
      <label
        className={styles.radio}
        style={{ color: "#FF3D12" }}
      >
        <input
          type="radio"
          name="reservationType"
          value="firstCome"
          checked={seatReservationEnabled === false}
          onChange={() => setSeatReservationEnabled(false)}
          className={styles.radioInput}
        />
        선착순
      </label>
      <label className={styles.radio} style={{ marginLeft: "1rem", color: "#FF3D12" }}>
        <input
          type="radio"
          name="reservationType"
          value="seat"
          checked={seatReservationEnabled === true}
          onChange={() => setSeatReservationEnabled(true)}
          className={styles.radioInput}
        />
        좌석예매
      </label>
      
    </span>
  </div>
)}
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>러닝타임</span>
                  </span>
                  <span
                    className={styles.variable_Info}
                    style={{
                      display: "inline-flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="number"
                      placeholder="000"
                      onChange={(e) => setRunTime(e.target.value)}
                      style={{ width: "5rem" }}
                    />
                    <span style={{ color: "#121212", marginLeft: "0.5rem" }}>
                      분
                    </span>
                  </span>
                </div>
                {/* <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>좌석수</span>
                  </span>
                  <span
                    className={styles.variable_Info}
                    style={{
                      display: "inline-flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="number"
                      placeholder="000"
                      onChange={(e) => setMaxPeople(e.target.value)}
                      style={{ width: "5rem" }}
                    />
                    <span style={{ color: "#121212", marginLeft: "0.5rem" }}>
                      석
                    </span>
                  </span>
                </div> */}
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>담당자</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div className={styles.manager}>
                      <input
                        type="text"
                        placeholder="이름"
                        onChange={(e) => setManager(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="연락처(전화번호 혹은 이메일)"
                        onChange={(e) => setManagerPhoneNumber(e.target.value)}
                      />
                    </div>
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>입금계좌</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div className={styles.bank}>
                      <Dropdown
                        onChange={(val) => setAccountBankName(val)}
                        defaultValue="은행명"
                        options={[
                          "신한",
                          "농협",
                          "하나",
                          "수협",
                          "우리",
                          "토스",
                          "카카오",
                          "국민",
                          "기업",
                          "우체국",
                          "새마을금고",
                          "신협",
                        ]}
                        style={{ width: "15rem", height: "36px" }}
                        value={accountBankName}
                      />
                      <input
                        type="text"
                        placeholder="'-'없이 숫자만 입력"
                        onChange={(e) => setAccountNumber(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="예금주"
                        onChange={(e) => setAccountName(e.target.value)}
                      />
                    </div>
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>송금QR</span>
                  </span>
                  <span
                    className={styles.variable_Info}
                    style={{
                      display: "inline-flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <div className={styles.qr}>
                      {/* QR 미리보기 */}
                      {qrPreview && (
                        <img
                          src={qrPreview}
                          alt="QR 미리보기"
                          style={{
                            maxWidth: 160,
                            maxHeight: 160,
                            display: "block",
                            marginBottom: 8,
                          }}
                        />
                      )}
                      <label
                        className={styles.inputQrFileLabel}
                        htmlFor="inputQrFile"
                      >
                        파일 올리기
                      </label>
                      <input
                        className={styles.inputFile}
                        type="file"
                        id="inputQrFile" // ★ 라벨과 동일
                        accept="image/*"
                        onChange={handleQrChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  </span>
                </div>
                <div className={styles.smallInfo}>
                  *송금QR이 필요한 경우 파일을 올려주세요
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>공지</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <textarea
                      type="text"
                      placeholder={`티켓 수령 장소, 환불 방법 및 기간, 에티켓 등 작성\n(공백 포함 최대 700백자까지 작성 가능합니다.)`}
                      onChange={handleNotice}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>얼리버드</span>
                  </span>
                  <span
                    className={styles.variable_Info}
                    style={{
                      display: "inline-flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <label className={styles.radio}>
                      <input
                        type="radio"
                        name="earlyBird"
                        value="true"
                        checked={earlyBird === true}
                        onChange={() => setEarlyBird(true)}
                        className={styles.radioInput}
                      />
                      예
                    </label>
                    <label
                      className={styles.radio}
                      style={{ marginLeft: "1rem" }}
                    >
                      <input
                        type="radio"
                        name="earlyBird"
                        value="false"
                        checked={earlyBird === false}
                        onChange={() => setEarlyBird(false)}
                      />
                      아니요
                    </label>
                  </span>
                </div>
                <div className={styles.smallInfo}>
                  *얼리버드 티켓 할인 유무를 선택해주세요
                </div>
              </div>
            </div>
          </div>

          <div className={styles.Each_show_All}>
            <div className={styles.Each_shows}>공연 회차 만들기</div>

            <div className={styles.Each_shows_Name}>
              <div className={styles.form}>회차</div>
              <div>날짜</div>
              <div>시간</div>
              <div>구매제한매수</div>
              <div>가격</div>
              {seatReservationEnabled && (
                  <>
                    <div>VIP석 설정</div>
                  </>
              )}
              <div>회차추가</div>
              <div>삭제</div>
            </div>

            {shows.map((show, idx) => (
              <div key={show.id} className={styles.Detail_show}>
                <div className={styles.shows_line}>{idx + 1}공</div>
                <div className={styles.form_detail_date_2}>
                  <input
                    id={styles.form_detail_date}
                    type="date"
                    value={show.date || ""}
                    onChange={(e) =>
                      updateSchedule(show.id, "date", e.target.value)
                    }
                    style={{ width: "8rem" }}
                  />
                </div>
                <div className={styles.form_detail_time}>
                  <Dropdown
                    defaultValue={"00"}
                    options={[
                      "00",
                      "01",
                      "02",
                      "03",
                      "04",
                      "05",
                      "06",
                      "07",
                      "08",
                      "09",
                      "10",
                      "11",
                      "12",
                      "13",
                      "14",
                      "15",
                      "16",
                      "17",
                      "18",
                      "19",
                      "20",
                      "21",
                      "22",
                      "23",
                    ]}
                    style={{ width: "3.2rem" }}
                    value={show.hour || ""}
                    onChange={(val) => updateSchedule(show.id, "hour", val)}
                  />
                  <span className={styles.unit}>시</span>
                  <Dropdown
                    defaultValue={"00"}
                    options={[
                      "00",
                      "01",
                      "02",
                      "03",
                      "04",
                      "05",
                      "06",
                      "07",
                      "08",
                      "09",
                      "10",
                      "11",
                      "12",
                      "13",
                      "14",
                      "15",
                      "16",
                      "17",
                      "18",
                      "19",
                      "20",
                      "21",
                      "22",
                      "23",
                      "24",
                      "25",
                      "26",
                      "27",
                      "28",
                      "29",
                      "30",
                      "31",
                      "32",
                      "33",
                      "34",
                      "35",
                      "36",
                      "37",
                      "38",
                      "39",
                      "40",
                      "41",
                      "42",
                      "43",
                      "44",
                      "45",
                      "46",
                      "47",
                      "48",
                      "49",
                      "50",
                      "51",
                      "52",
                      "53",
                      "54",
                      "55",
                      "56",
                      "57",
                      "58",
                      "59",
                    ]}
                    style={{ width: "3.2rem" }}
                    value={show.minute || ""}
                    onChange={(val) => updateSchedule(show.id, "minute", val)}
                  />
                  <span className={styles.unit}>분</span>
                </div>
                <div className={styles.form_detail_number}>
                  <button
                    className={styles.ticket_Btn}
                    onClick={() => decMaxTicket(show.id)}
                  >
                    -
                  </button>
                  <span className={styles.ticket_Count}>
                    {show.maxTicket ?? 0}
                  </span>
                  <button
                    className={styles.ticket_Btn}
                    onClick={() => incMaxTicket(show.id)}
                  >
                    +
                  </button>
                </div>
                <div className={styles.form_detail_price_2}>
                  <input
                    className={styles.form_detail_price}
                    type="number"
                    value={show.cost || ""}
                    placeholder="0000"
                    onChange={(e) =>
                      updateSchedule(show.id, "cost", e.target.value)
                    }
                  />
                  원
                </div>
                {seatReservationEnabled && (
                  <>
                    <div className={styles.modal_btn} onClick={() => openNotReservationSeatModal(show.id)}>
                      설정
                    </div>
                </>
                )}
                <div className={styles.add_show} onClick={handleAddRow}>
                  추가
                </div>
                <div className={styles.delete_Btn}>
                  <button onClick={() => handleRemoveRow(show.id)}>
                    <img src={DELETE} alt="delete"></img>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className={styles.make_show_submit} onClick={makeShow}>
              생성하기
            </button>

          </div>
        </div>
      </div>
    </div>

    <NotReservationSeatModal
      open={notReservationSeatModalOpen}
      close={closeNotReservationSeatModal}
      onConfirm={handleConfirmFromModal}
      seatTicket={
        selectedShowId
          ? (shows.find(s => s.id === selectedShowId)?.seatTicket ?? [])
          : []
      }
    />
    </>
  );
}

export default CreateShow;
