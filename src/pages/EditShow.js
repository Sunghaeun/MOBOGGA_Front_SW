import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "./styles/CreateShow.module.css";
import axios from "axios";
import DELETE from "../assets/button_delete.svg";

function EditShow() {
  const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [poster, setPoster] = useState(null);
  const [qr, setQr] = useState(null);

  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [runtime, setRunTime] = useState("");
  const [managerPhoneNumber, setManagerPhoneNumber] = useState("");
  const [maxPeople, setMaxPeople] = useState(100);
  const [manager, setManager] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountBankName, setAccountBankName] = useState("");
  const [introductionLetter, setIntroductionLetter] = useState("");
  const [noticeLetter, setNoticeLetter] = useState("");
  const [earlyBird, setEarlyBird] = useState(false);

  const [posterUrl, setPosterUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  const [posterPreview, setPosterPreview] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  const [shows, setShows] = useState([
    {
      id: Date.now(),
      orderIndex: 1,
      date: "",
      time: "",
      cost: "",
      maxTicket: 1,
      maxPeople: 100,
    },
  ]);

  const updateSchedule = (rowId, key, value) => {
    setShows((prevShows) =>
      prevShows.map((show, index) =>
        show.id === rowId
          ? { ...show, [key]: value, orderIndex: index + 1 }
          : show
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

  // 파일 변경 핸들러(포스터)
  const handlePosterChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (posterPreview?.startsWith("blob:")) URL.revokeObjectURL(posterPreview);

    setPoster(file);
    setPosterPreview(file ? URL.createObjectURL(file) : posterUrl || null);
  };

  // 파일 변경 핸들러(QR)
  const handleQrChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (qrPreview?.startsWith("blob:")) URL.revokeObjectURL(qrPreview);

    setQr(file);
    setQrPreview(file ? URL.createObjectURL(file) : qrUrl || null);
  };

  useEffect(() => {
    return () => {
      if (posterPreview?.startsWith("blob:"))
        URL.revokeObjectURL(posterPreview);
      if (qrPreview?.startsWith("blob:")) URL.revokeObjectURL(qrPreview);
    };
  }, [posterPreview, qrPreview]);

  const getAuthHeader = () => {
    const raw =
      localStorage.getItem("jwt") ||
      sessionStorage.getItem("jwt") ||
      sessionStorage.getItem("idToken");
    if (!raw) return null;
    return raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
  };

  const getShow = async () => {
    try {
      const auth = getAuthHeader();
      if (!auth) {
        alert("로그인이 필요합니다.");
        return;
      }
      const res = await axios.get(`${API_BASE}/manager/show/update/${id}`, {
        headers: { Authorization: auth },
      });
      console.log(`[GET] /manager/show/update/${id} 성공`, {
        status: res.status,
        data: res.data,
      });

      const src = res.data ?? {};
      setName(src.name ?? "");
      setLocation(src.location ?? "");
      setStartDate(src.startDate ?? "");
      setEndDate(src.endDate ?? "");
      setRunTime(src.runtime != null ? String(src.runtime) : "");
      setManager(src.manager ?? "");
      setManagerPhoneNumber(src.managerPhoneNumber ?? "");
      setAccountNumber(src.accountNumber ?? "");
      setAccountName(src.accountName ?? "");
      setAccountBankName(src.accountBankName ?? "");
      setIntroductionLetter(src.introductionLetter ?? "");
      setNoticeLetter(src.noticeLetter ?? "");
      setEarlyBird(src.earlyBird === true);

      const list = Array.isArray(src.scheduleDtoList)
        ? src.scheduleDtoList
        : [];

      const mapped =
        list.length > 0
          ? list.map((s, i) => ({
              id: s.id ?? Date.now() + i,
              orderIndex: s.orderIndex ?? i + 1,
              date: s.date ?? "",
              time: (s.time ?? "").slice(0, 5), // "HH:mm:ss" -> "HH:mm"
              cost: s.cost != null ? String(s.cost) : "",
              maxTicket: s.maxTicket != null ? Number(s.maxTicket) : 0,
              maxPeople: s.maxPeople != null ? Number(s.maxPeople) : 0,
            }))
          : [
              {
                id: Date.now(),
                orderIndex: 1,
                date: "",
                time: "",
                cost: "",
                maxTicket: 1,
                maxPeople: 100,
              },
            ];

      setShows(mapped);

      // 이미지 URL
      const serverPoster = src.photo || src.posterUrl || "";
      const serverQr = src.qr || src.qrUrl || "";
      setPosterUrl(serverPoster);
      setQrUrl(serverQr);
      setPosterPreview(serverPoster || null);
      setQrPreview(serverQr || null);

      // 디버깅: 받은 회차 출력
      console.log("받은 scheduleDtoList:", list);
      console.log("화면에 세팅될 shows:", mapped);
    } catch (err) {
      console.error("공연 데이터 로드 실패", err);
    }
  };

  useEffect(() => {
    if (id) getShow();
    // eslint-disable-next-line
  }, [id]);

  const updateShow = async () => {
    const authHeader = getAuthHeader();
    if (!authHeader) {
      alert("로그인 토큰이 없습니다. 다시 로그인 해주세요.");
      return;
    }

    if (!name) return alert("제목을 입력해 주세요");
    if (!location) return alert("장소를 입력해 주세요");
    if (!runtime || Number(runtime) <= 0)
      return alert("런타임을 입력해 주세요");

    for (let i = 0; i < shows.length; i++) {
      if (!shows[i].date) return alert(`${i + 1}공의 날짜를 입력해 주세요`);
      if (!shows[i].time) return alert(`${i + 1}공의 시작시간을 입력해 주세요`);
      if (!shows[i].cost || Number(shows[i].cost) <= 0)
        return alert(`${i + 1}공의 가격을 입력해 주세요`);
    }

    const toHms = (t) => (t && t.length === 5 ? `${t}:00` : t || "");

    const requestData = {
      name,
      location,
      startDate,
      endDate,
      runtime: Number(runtime),
      manager,
      managerPhoneNumber,
      accountNumber,
      accountName,
      accountBankName,
      introductionLetter,
      noticeLetter,
      earlyBird: Boolean(earlyBird),
      scheduleDtoList: shows.map((s, i) => ({
        id: Number(s.orderIndex) || i + 1,
        orderIndex: Number(s.order) || i + 1,
        date: s.date,
        time: toHms(s.time),
        cost: Number(s.cost),
        maxTicket: Number(s.maxTicket) || 0,
        maxPeople: Number(s.maxPeople) || 100,
      })),
    };

    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );
    if (poster instanceof File) {
      formData.append("poster", poster, poster.name || "poster.jpg");
    }
    if (qr instanceof File) {
      // 서버가 대문자 "QR"을 기대한다고 했으니 그대로 보냅니다.
      formData.append("QR", qr, qr.name || "qr.jpg");
    }

    const endpoint = `${API_BASE}/manager/show/update/${id}`;
    console.log("== 최종 전송 JSON ==", JSON.stringify(requestData, null, 2));
    console.log("== FormData entries ==");
    for (const [k, v] of formData.entries()) {
      if (v instanceof File) {
        console.log(k, "-> File", { name: v.name, size: v.size, type: v.type });
      } else if (k === "request" && v instanceof Blob) {
        v.text().then((t) => console.log("request(json) ->", t));
      } else {
        console.log(k, "->", v);
      }
    }

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("로그인 필요");
        return;
      }

      const resp = await axios.put(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("저장 성공", resp.data);
      const { publicId, showId, id: respId } = resp.data || {};
      const detailId = publicId ?? showId ?? id ?? respId;
      if (detailId) {
        navigate(`/show/${detailId}`);
      } else {
        alert(
          "생성은 성공했지만 상세 ID가 응답에 없습니다. 메인으로 이동합니다."
        );
        navigate("/main");
      }
    } catch (error) {
      console.error("저장 오류", error);
      if (error?.response?.status === 401) {
        console.log(
          "[401] Authorization 헤더 유무/형식, 토큰 만료(exp)/aud/iss, 또는 권한(ROLE) 확인 필요"
        );
      }
      alert(
        `저장 실패: ${
          error.response?.data?.message || error.message || "알 수 없는 오류"
        }`
      );
    }
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
    if (e.target.value.length <= 300) setNoticeLetter(e.target.value);
    else alert("300자를 초과할 수 없습니다.");
  };

  const handleAddRow = () => {
    setShows((prev) => {
      const next = [
        ...prev,
        {
          id: Date.now(),
          orderIndex: prev.length + 1,
          date: "",
          time: "",
          cost: "",
          maxTicket: 1,
          maxPeople: 100,
        },
      ];
      return next.map((s, i) => ({ ...s, orderIndex: i + 1 }));
    });
  };

  const handleRemoveRow = (rowId) => {
    setShows((prev) =>
      prev
        .filter((s) => s.id !== rowId)
        .map((s, i) => ({ ...s, orderIndex: i + 1 }))
    );
  };

  return (
    <div>
      <div className={styles.CreateBody}>
        <div className={styles.headText}>공연 새로 만들기</div>
        <div className={styles.Create_Container}>
          <div className={styles.Detail_Entire_Box}>
            {/* 포스터 업로드 */}
            <div className={styles.SImage_Box_Entire}>
              <div className={styles.SImage_Box}>
                <img
                  src={
                    posterPreview ||
                    "https://via.placeholder.com/300x400?text=Poster"
                  }
                  alt="포스터 미리보기"
                />
              </div>
              <label className={styles.inputFileLabel} htmlFor="posterFile">
                이미지 추가
                <input
                  className={styles.inputFile}
                  type="file"
                  id="posterFile"
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
                      value={introductionLetter}
                      onChange={handleIntro}
                      style={{ height: "6rem", width: "27rem" }}
                    />
                  </span>
                </div>

                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>카테고리</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div className={styles.form_detail_date_2}>
                      <input
                        id={styles.form_detail_date}
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />{" "}
                      ~{" "}
                      <input
                        id={styles.form_detail_date}
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </span>
                </div>

                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>장소</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="text"
                      placeholder="공연 장소"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={{ width: "10.75rem" }}
                    />
                  </span>
                </div>

                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>러닝타임</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="number"
                      placeholder="000"
                      value={runtime}
                      onChange={(e) => setRunTime(e.target.value)}
                      style={{ width: "3rem" }}
                    />
                  </span>
                  <span>분</span>
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
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                        style={{ width: "4.75rem" }}
                      />
                      <input
                        type="text"
                        placeholder="연락처(전화번호 혹은 이메일)"
                        value={managerPhoneNumber}
                        onChange={(e) => setManagerPhoneNumber(e.target.value)}
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
                        onChange={(e) => setAccountBankName(e.target.value)}
                        value={accountBankName}
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
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        style={{ width: "11.75rem" }}
                      />
                      <input
                        type="text"
                        placeholder="예금주"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        style={{ width: "4.75rem" }}
                      />
                    </div>
                  </span>
                </div>

                {/* QR 업로드 + 미리보기 */}
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>송금QR</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div className={styles.qr}>
                      <label
                        className={styles.inputQrFileLabel}
                        htmlFor="qrFile"
                      >
                        파일 올리기
                        <input
                          className={styles.inputFile}
                          type="file"
                          id="qrFile"
                          accept="image/*"
                          onChange={handleQrChange}
                        />
                      </label>
                      {qrPreview && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <img
                            src={qrPreview}
                            alt="QR 미리보기"
                            style={{
                              width: 120,
                              height: 120,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        </div>
                      )}
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
                      placeholder={`티켓 수령 장소, 환불 방법 및 기간, 에티켓 등 작성\n(공백 포함 최대 300백자까지 작성 가능합니다.)`}
                      value={noticeLetter}
                      onChange={handleNotice}
                      style={{ width: "27rem", height: "16rem" }}
                    />
                  </span>
                </div>

                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>얼리버드</span>
                  </span>
                  <span className={styles.variable_Info}>
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

          {/* 회차 테이블 */}
          <div className={styles.Each_show_All}>
            <div className={styles.Each_shows}>공연 회차 만들기</div>

            <div className={styles.Each_shows_Name}>
              <div className={styles.form}>회차</div>
              <div>날짜</div>
              <div>시간</div>
              <div>구매제한매수</div>
              <div>가격</div>
              <div>회차 추가</div>
              <div>삭제</div>
            </div>

            {shows.map((show, idx) => (
              <div key={show.id} className={styles.Detail_show}>
                <div className={styles.shows_line}>
                  {(show.orderIndex ?? idx + 1) + "공"}
                </div>

                <div className={styles.form_detail_date_2}>
                  <input
                    id={styles.form_detail_date}
                    type="date"
                    value={show.date || ""}
                    onChange={(e) =>
                      updateSchedule(show.id, "date", e.target.value)
                    }
                  />
                </div>

                <div className={styles.form_detail_time_2}>
                  <input
                    id={styles.form_detail_time}
                    type="time"
                    value={show.time || ""}
                    onChange={(e) =>
                      updateSchedule(show.id, "time", e.target.value)
                    }
                  />
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
                    placeholder="0000"
                    value={show.cost || ""}
                    onChange={(e) =>
                      updateSchedule(show.id, "cost", e.target.value)
                    }
                  />
                  원
                </div>
                <div className={styles.add_show} onClick={handleAddRow}>
                  추가
                </div>

                <div className={styles.delete_Btn}>
                  <button onClick={() => handleRemoveRow(show.id)}>
                    <img src={DELETE} alt="delete" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <button className={styles.make_show_submit} onClick={updateShow}>
              공연 업데이트하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditShow;
