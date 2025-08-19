import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "./styles/CreateShow.module.css";
import useAuthStore from "../stores/authStore";
import apiClient from "../utils/apiClient";
import DELETE from "../assets/button_delete.svg";
import Dropdown from "../components/Dropdown";

function EditShow() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    user,
    isLoggedIn,
    isManager,
    token,
    isLoading: authLoading,
  } = useAuthStore();

  const [name, setName] = useState("");
  const [poster, setPoster] = useState(null);
  const [qr, setQr] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [runtime, setRunTime] = useState("");
  const [managerPhoneNumber, setManagerPhoneNumber] = useState("");
  // eslint-disable-next-line
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
    if (key === "time") {
      console.warn("⚠️ time은 setShowTimePart를 통해서만 수정하세요.");
      return;
    }
    setShows((prev) =>
      prev.map((s, index) =>
        s.id === rowId ? { ...s, [key]: value, orderIndex: index + 1 } : s
      )
    );
  };

  const setShowTimePart = (rowId, part, val) => {
    setShows((prev) =>
      prev.map((s) => {
        if (s.id !== rowId) return s;
        const nextHour = part === "hour" ? val : s.timeHour ?? "00";
        const nextMin = part === "minute" ? val : s.timeMinute ?? "00";
        const nextHHMM = `${nextHour}:${nextMin}`;
        return {
          ...s,
          timeHour: nextHour,
          timeMinute: nextMin,
          time: `${nextHHMM}:00`, // 서버 전송용 규격 "HH:mm:ss"
        };
      })
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

  // 권한 체크
  useEffect(() => {
    console.log("=== EDIT SHOW INIT ===");
    console.log("로그인 상태:", isLoggedIn);
    console.log("매니저 권한:", isManager());
    console.log("인증 로딩 상태:", authLoading);
    console.log("사용자 정보:", user);
    console.log("토큰 존재:", !!token);

    // authLoading이 undefined이면 false로 처리
    const loading = authLoading === undefined ? false : authLoading;

    if (loading) {
      console.log("인증 상태 로딩 중...");
      return;
    }

    if (!isLoggedIn || !isManager()) {
      console.log("권한 없음 - 로그인 페이지로 리다이렉트");
      console.log("상세 권한 정보:", {
        isLoggedIn,
        isManagerResult: isManager(),
        userAuthority: user?.authority,
        userRole: user?.role,
      });
      alert("로그인이 필요하거나 매니저 권한이 없습니다.");
      navigate("/login", { replace: true });
      return;
    }

    console.log("권한 확인 완료");
  }, [isLoggedIn, isManager, navigate, authLoading, user, token]);

  // 더 이상 사용하지 않는 함수 (쿠키 + 임시 토큰 방식으로 대체)
  // const getAuthHeader = () => {
  //   const token = window.tempToken;
  //   if (!token) return null;
  //   return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  // };

  const getShow = async () => {
    // authLoading이 undefined이면 false로 처리
    const loading = authLoading === undefined ? false : authLoading;

    if (loading) {
      console.log("인증 상태 로딩 중이므로 데이터 조회 대기");
      return;
    }

    if (!isLoggedIn || !isManager()) {
      console.log("권한 없음 - 데이터 조회 불가");
      return;
    }

    try {
      setDataLoading(true);
      setError(null);
      console.log(`공연 데이터 로드 시작: ID ${id}`);
      console.log("API 요청 전 토큰 상태:", {
        tokenExists: !!token,
        tokenLength: token?.length,
        isLoggedIn,
        isManager: isManager(),
        userAuthority: user?.authority,
      });

      // JWT 토큰 디코딩해서 확인
      if (token) {
        try {
          const tokenParts = token.split(".");
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log("🔍 JWT 토큰 페이로드:", {
              sub: payload.sub,
              role: payload.role,
              exp: payload.exp,
              expDate: new Date(payload.exp * 1000),
              currentTime: new Date(),
              isExpired: payload.exp * 1000 < Date.now(),
            });
          } else {
            console.log(
              "❌ JWT 토큰 형식이 올바르지 않음 - parts:",
              tokenParts.length
            );
          }
        } catch (e) {
          console.log("❌ JWT 토큰 파싱 에러:", e);
        }
      }

      // API 요청
      const res = await apiClient.get(`/manager/show/update/${id}`);
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
          ? list.map((s, i) => {
              const hhmm = (s.time ?? "").slice(0, 5); // "HH:mm"
              const [hh = "00", mm = "00"] = hhmm.split(":");
              return {
                id: s.id ?? Date.now() + i,
                orderIndex: s.orderIndex ?? i + 1,
                date: s.date ?? "",
                time: hhmm, // 원본 유지
                timeHour: hh, // 화면 표시용
                timeMinute: mm, // 화면 표시용
                cost: s.cost != null ? String(s.cost) : "",
                maxTicket: s.maxTicket != null ? Number(s.maxTicket) : 0,
                maxPeople: s.maxPeople != null ? Number(s.maxPeople) : 0,
              };
            })
          : [
              {
                id: Date.now(),
                orderIndex: 1,
                date: "",
                time: "", // 비어있을 때도 화면용 기본값 채워두면 편함
                timeHour: "00",
                timeMinute: "00",
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
      console.error("에러 상세 정보:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.status === 401) {
        console.log("401 오류 - 인증 문제");
        console.log("현재 인증 상태:", {
          token: !!token,
          tokenLength: token?.length,
          isLoggedIn,
          isManager: isManager(),
          userInfo: user,
        });
        setError("인증에 문제가 있습니다. 다시 로그인해주세요.");
      } else {
        setError("공연 데이터를 불러오는데 실패했습니다.");
      }
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    console.log("=== getShow useEffect 실행 ===");
    console.log("조건 체크:", {
      id: !!id,
      authLoading,
      isLoggedIn,
      isManager: isManager(),
      token: !!token,
    });

    // authLoading이 undefined이면 false로 처리
    const loading = authLoading === undefined ? false : authLoading;

    if (id && !loading && isLoggedIn && isManager()) {
      console.log("조건 만족 - getShow 실행");
      getShow();
    } else {
      console.log("조건 불만족 - getShow 실행하지 않음");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, authLoading, isLoggedIn, isManager, token]);

  const updateShow = async () => {
    if (!isLoggedIn || !isManager()) {
      alert("로그인이 필요하거나 매니저 권한이 없습니다.");
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
      formData.append("poster", poster);
    }
    if (qr instanceof File) {
      // 서버가 대문자 "QR"을 기대한다고 했으니 그대로 보냅니다.
      formData.append("QR", qr);
    }

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
    const hasSession = document.cookie.includes("session=");
    if (!hasSession && !token) {
      alert("로그인 세션이 없습니다. 다시 로그인해 주세요.");
      navigate("/login");
      return;
    }

    try {
      const resp = await apiClient.put(`/manager/show/update/${id}`, formData);

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
          time: "00:00",
          timeHour: "00",
          timeMinute: "00",
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

  // 로딩 상태
  // authLoading이 undefined이면 false로 처리
  const loading = authLoading === undefined ? false : authLoading;

  if (loading || dataLoading) {
    return (
      <div className={styles.CreateBody}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div>
            {loading ? "인증 상태 확인 중" : "공연 정보를 불러오고 있습니다"}
            ...
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.CreateBody}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
          <button onClick={() => getShow()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.CreateBody}>
        <div className={styles.headText}>공연 수정하기</div>
        <div className={styles.Create_Container}>
          <div className={styles.Detail_Entire_Box}>
            {/* 포스터 업로드 */}
            <div className={styles.SImage_Box_Entire}>
              <div className={styles.SImage_Box}>
                <img src={posterPreview} alt="포스터 미리보기" />
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
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      {"     "}~{"     "}
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
                    />
                  </span>
                </div>

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
                      value={runtime}
                      onChange={(e) => setRunTime(e.target.value)}
                      style={{ width: "5rem" }}
                    />
                    <span style={{ color: "#121212", marginLeft: "0.5rem" }}>
                      분
                    </span>
                  </span>
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
                      />
                      <input
                        type="text"
                        placeholder="연락처(전화번호 혹은 이메일)"
                        value={managerPhoneNumber}
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
                        onChange={(e) => setAccountBankName(e.target.value)}
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
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="예금주"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                      />
                    </div>
                  </span>
                </div>

                {/* QR 업로드 + 미리보기 */}
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

          {/* 회차 테이블 */}
          <div className={styles.Each_show_All}>
            <div className={styles.Each_shows}>공연 회차 수정</div>

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
                    style={{ width: "11rem" }}
                  />
                </div>

                <div className={styles.form_detail_time}>
                  <Dropdown
                    defaultValue="00"
                    options={Array.from({ length: 24 }, (_, i) =>
                      String(i).padStart(2, "0")
                    )}
                    style={{ width: "3.75rem" }}
                    value={show.timeHour ?? "00"}
                    onChange={(e) =>
                      setShowTimePart(show.id, "hour", e.target.value)
                    }
                  />
                  <span className={styles.unit}>시</span>
                  <Dropdown
                    defaultValue="00"
                    options={Array.from({ length: 60 }, (_, i) =>
                      String(i).padStart(2, "0")
                    )}
                    style={{ width: "3.75rem" }}
                    value={show.timeMinute ?? "00"}
                    onChange={(e) =>
                      setShowTimePart(show.id, "minute", e.target.value)
                    }
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
              수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditShow;
