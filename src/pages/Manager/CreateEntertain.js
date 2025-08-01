import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "../styles/CreateShow.module.css";
import axios from "axios";
import DELETE from "../../assets/button_delete.svg";

function CreateEntertain() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [clubName, setClubName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [runtime, setRunTime] = useState("");
  const [intro, setIntro] = useState("");
  const [content, setContent] = useState("");
  const [account, setAccount] = useState("");
  const [maxTickets, setMaxTickets] = useState("");
  const [category, setCategory] = useState("");
  const [count, setCount] = useState(1);
  const [schedule, setSchedule] = useState({
    order: 0,
    date: "",
    time: "",
    cost: "",
    maxPeople: "",
  });
  const [previewURL, setPreviewURL] = useState(null);
  useEffect(() => {
    setCount(1);
  }, [schedule]);

  const Minus = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const Plus = () => {
    if (count) {
      setCount(count + 1);
    }
  };

  //기존값 확인하고 새로 생긴 schedule 정보 받아옴
  const updateSchedule = (id, key, value) => {
    setShows((prevShows) =>
      prevShows.map((show, index) =>
        show.id === id ? { ...show, [key]: value, order: index + 1 } : show
      )
    );
  };

  //schedule 추가 초기 state 설정정
  const [shows, setShows] = useState([{ id: Date.now() }]);

  /* 사진 미리보기 기능 */
  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(file);
      setPreviewURL(URL.createObjectURL(file)); //미리 보기 url 생성
    } else {
      setQrImage(null);
    }
  };

  const handleQrImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrImage(file);
    } else {
      setQrImage(null);
    }
  };

  //모든 입력란을 받아야 submit 가능 + 빈칸이 어디인지 알려줌
  const makeShow = async () => {
    if (!title) {
      alert("제목을 입력해 주세요");
      return;
    }
    if (!poster || !(poster instanceof File)) {
      alert("공연 이미지를 선택해 주세요");
      console.log("포스터 파일 확인:", poster);
      return;
    }
    if (!clubName) {
      alert("동아리명을 입력해 주세요");
      return;
    }
    if (!location) {
      alert("장소를 입력해 주세요");
      return;
    }
    if (!startDate) {
      alert("시작날짜를 입력해 주세요");
      return;
    }
    if (!endDate) {
      alert("끝 날짜를 입력해 주세요");
      return;
    }
    if (!runtime || runtime <= 0) {
      alert("런타임을 입력해 주세요");
      return;
    }
    if (!account) {
      alert("계좌를 입력해 주세요");
      return;
    }
    if (!maxTickets || maxTickets <= 0) {
      alert("인당 최대 구매가능 티켓수를 입력해 주세요");
      return;
    }
    if (shows.length === 0) {
      alert("최소 한 개 이상의 회차 정보를 입력해야 합니다.");
      return;
    }
    for (let i = 0; i < shows.length; i++) {
      if (!shows[i].date) {
        alert(`${i + 1}공의 날짜를 입력해 주세요`);
        return;
      }
      if (!shows[i].time) {
        alert(`${i + 1}공의 시작시간을 입력해 주세요`);
        return;
      }
      if (!shows[i].cost || shows[i].cost <= 0) {
        alert(`${i + 1}공의 가격을 입력해 주세요`);
        return;
      }
      if (!shows[i].maxPeople || shows[i].maxPeople <= 0) {
        alert(`${i + 1}공의 수용 인원을 입력해 주세요`);
        return;
      }
    }

    const fileInput = document.getElementById("handleQr");
    if (fileInput && fileInput.files.length === 0) {
      console.log("QR 파일이 선택 되지 않았습니다.");
      setQrImage(null);
    }

    console.log("show : ", shows);
    console.log("Schedule : ", schedule);

    //보내주어야 하는 전체 데이터
    const requestData = {
      userId: sessionStorage.getItem("serverResponse"),
      title,
      clubName,
      location,
      startDate,
      endDate,
      category,
      runtime,
      account,
      content,
      maxTickets,
      // scheduleList:[schedule]
      schedule: shows.map((show) => ({
        order: show.order,
        date: show.date,
        time: show.time,
        cost: show.cost,
        maxPeople: show.maxPeople,
      })),
    };
    const formData = new FormData();
    formData.append("poster", poster);

    // if (qrImage && qrImage instanceof File) {
    //   formData.append("qrImage", qrImage);
    // } else {
    //   console.warn("qrImage가 존재하지 않거나 파일이 아닙니다:", qrImage);
    // }
    if (qrImage && qrImage instanceof File) {
      formData.append("qrImage", qrImage);
    } else {
      console.log("QR 이미지 없음, formData에 추가되지 않음");
      formData.delete("qrImage");
    }

    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    ); //request는 모두 application으로 긔긔
    // formData.append("title", title);
    // formData.append("clubName", clubName);
    // formData.append("location", location);
    // formData.append("startDate", startDate);
    // formData.append("endDate", endDate);
    // formData.append("runtime", runtime);
    // formData.append("account", account);
    // formData.append("content", content);
    // formData.append("maxTickets", maxTickets);
    // formData.append("poster", poster);

    console.log("폼 데이터 확인:");
    for (let [key, value] of formData.entries()) {
      if (key === "request") {
        value.text().then((text) => console.log(`${key}:`, JSON.parse(text)));
      } else if (value instanceof File) {
        console.log(`${key}:`, value.name); // 파일 이름 출력
      } else {
        console.log(`${key}:`, value);
      }
    }

    try {
      const response = await axios.post(
        `https://jinjigui.info:443/manager/create/save`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("저장 성공", response.data);

      if (response.data.status === true) {
        alert("저장이 완료되었습니다.").then(() => {
          navigate("/");
        });
      } else {
        alert("저장은 되었지만, 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("저장 오류", error);
      alert(
        "저장 실패",
        `서버 오류:${error.response?.data?.message || "알 수 없는 오류"}`,
        "error"
      );
    }
  };

  //제목 글자 수 limit
  const handletitle = (e) => {
    if (e.target.value.length <= 30) {
      setTitle(e.target.value);
    } else {
      alert("30글자를 초과할 수 없습니다.");
    }
  };

  const handleIntro = (e) => {
    if (e.target.value.length <= 100) {
      setIntro(e.target.value);
    } else {
      alert("100자를 초과할 수 없습니다.");
    }
  };

  // 공연 소개란 limit
  const handleContent = (e) => {
    if (e.target.value.length <= 300) {
      setContent(e.target.value);
    } else {
      alert("300자를 초과할 수 없습니다.");
    }
  };

  // 회차 행 추가
  const handleAddRow = () => {
    // const newArr = [{...schedule}, {id: Date.now()}];
    // console.log(newArr);
    setShows((prevShow) => [
      ...prevShow,
      {
        id: Date.now(),
        order: prevShow.length + 1,
        date: "",
        time: "",
        cost: "",
        maxPeople: "",
      },
    ]);
  };

  // 해당 행 삭제
  const handleRemoveRow = (id) => {
    setShows(shows.filter((show) => show.id !== id));
  };

  /* 기존의 사진을 받아온 방식 */
  // const handleImage = (e) => {
  //   setPoster(e.target.files[0]);
  // };

  return (
    <div>
      <div className={styles.CreateBody}>
        <div className={styles.headText}>새로 만들기</div>
        <div className={styles.Create_Container}>
          <div className={styles.Detail_Entire_Box}>
            <div className={styles.SImage_Box_Entire}>
              <div className={styles.SImage_Box}>
                <img src={previewURL} alt="미리보기" />
              </div>
              <input
                type="file"
                id="fileUpload"
                accept="image/*"
                onChange={handleImg}
              />
            </div>

            <div className={styles.entir_Boxs}>
              <div className={styles.infos}>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>제목</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="text"
                      placeholder="공연 이름(공백포함 최대 30자까지 작성 가능합니다.)"
                      value={title}
                      onChange={handletitle}
                      style={{ width: "27rem" }}
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
                      onChange={(e) => setClubName(e.target.value)}
                      style={{ height: "6rem", width: "27rem" }}
                    />
                  </span>
                </div>
                <div className={styles.form_detail_date_2}>
                  <input id={styles.form_detail_date} type="date" /> ~
                  <input id={styles.form_detail_date} type="date" />
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>담당자</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div className={styles.manager}>
                      <input
                        type="text"
                        placeholder="이름"
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ width: "4.75rem" }}
                      />
                      <input
                        type="text"
                        placeholder="연락처(전화번호 혹은 이메일)"
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ width: "21rem" }}
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
                      <select
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: "8rem" }}
                      >
                        <option value="">OO은행</option>
                        <option value="농협">농협</option>
                        <option value="하나">하나</option>
                        <option value="신한">신한</option>
                        <option value="현대">현대</option>
                        <option value="카카오">카카오</option>
                        <option value="토스">토스</option>
                      </select>
                      <input
                        type="text"
                        placeholder="'-'없이 숫자만 입력"
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ width: "11.75rem" }}
                      />
                      <input
                        type="text"
                        placeholder="예금주"
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ width: "4.75rem" }}
                      />
                    </div>
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>공지</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <textarea
                      type="text"
                      placeholder={`티켓 수령 장소, 환불 방법 및 기간, 에티켓 등 작성\n(공백 포함 최대 300백자까지 작성 가능합니다.)`}
                      onChange={handleContent}
                      style={{ width: "27rem", height: "16rem" }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.Each_show_All}>
            <div className={styles.Each_shows}>공연 회차 만들기</div>

            {/* 상세 공연 이름들 헤더 */}
            <div className={styles.Each_shows_Name}>
              <div className={styles.form}>회차</div>
              <div>날짜</div>
              <div>시간</div>
              <div>구매제한매수</div>
              <div>가격</div>
              <div>삭제</div>
            </div>

            {/* 실제 회차 행들 */}
            {shows.map((show) => (
              <div key={show.id} className={styles.Detail_show}>
                {/* 회차 입력란 */}
                <div className={styles.shows_line}>
                  <input
                    className={styles.form_detail_show}
                    type="number"
                    // inputMode="numeric"
                    placeholder="0"
                    onChange={(e) =>
                      updateSchedule(show.id, "order", e.target.value)
                    }
                  />
                  공
                </div>
                <div className={styles.form_detail_date_2}>
                  <input
                    id={styles.form_detail_date}
                    type="date"
                    onChange={(e) =>
                      updateSchedule(show.id, "date", e.target.value)
                    }
                  />
                </div>
                <div className={styles.form_detail_time_2}>
                  <input
                    id={styles.form_detail_time}
                    type="time"
                    onChange={(e) =>
                      updateSchedule(show.id, "time", e.target.value)
                    }
                  />
                </div>
                <div className={styles.form_detail_number}>
                  <button className={styles.ticket_Btn} onClick={Minus}>
                    -
                  </button>
                  <span className={styles.ticket_Count}>{count}</span>
                  <button className={styles.ticket_Btn} onClick={Plus}>
                    +
                  </button>
                </div>
                <div className={styles.form_detail_price_2}>
                  <input
                    className={styles.form_detail_price}
                    type="number"
                    placeholder="0000"
                    onChange={(e) =>
                      updateSchedule(show.id, "cost", e.target.value)
                    }
                  />
                  원
                </div>
                <div className={styles.delete_Btn}>
                  <button onClick={() => handleRemoveRow(show.id)}>
                    <img src={DELETE} alt="delete"></img>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* 회차 추가 버튼 */}
          <div className={styles.add_show} onClick={handleAddRow}>
            추가
          </div>

          <div>
            <button className={styles.make_show_submit} onClick={makeShow}>
              공연 만들기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEntertain;
