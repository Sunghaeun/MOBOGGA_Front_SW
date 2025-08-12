import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "./styles/CreateEntertain.module.css";
import axios from "axios";
import INSTA from "../../assets/icons/instagram.svg";
import KAKAO from "../../assets/icons/kakao.svg";
import YOUTUBE from "../../assets/icons/youtube.svg";
import NOTION from "../../assets/icons/notion.svg";
import LINK from "../../assets/icons/linkicons.svg";
function CreateEntertain() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState(null);
  const [clubName, setClubName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [manager, setManager] = useState("");
  const [managerphone, setManagerPhone] = useState("");
  const [intro, setIntro] = useState("");
  const [category, setCategory] = useState("");
  const [insta, setInsta] = useState("");
  const [kakao, setKakao] = useState("");
  const [youtube, setYoutube] = useState("");
  const [notion, setNotion] = useState("");
  const [link, setLink] = useState("");

  const [content, setContent] = useState("");
  const [count, setCount] = useState(1);
  const [previewURL, setPreviewURL] = useState(null);

  /* 사진 미리보기 기능 */
  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(file);
      setPreviewURL(URL.createObjectURL(file)); //미리 보기 url 생성
    } else {
    }
  };

  //모든 입력란을 받아야 submit 가능 + 빈칸이 어디인지 알려줌
  const makeEntertain = async () => {
    if (!title) {
      alert("제목을 입력해 주세요");
      return;
    }
    if (!poster || !(poster instanceof File)) {
      alert("즐길거리 이미지를 선택해 주세요");
      console.log("포스터 파일 확인:", poster);
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
    //보내주어야 하는 전체 데이터
    // const requestData = {
    //   userId: sessionStorage.getItem("serverResponse"),
    //   title,
    //   clubName,
    //   location,
    //   startDate,
    //   endDate,
    //   category,
    //   content,
    // };
    const formData = new FormData();
    formData.append("poster", poster);

    // formData.append(
    //   "request",
    //   new Blob([JSON.stringify(requestData)], { type: "application/json" })
    // ); //request는 모두 application으로 긔긔
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

  return (
    <div>
      <div className={styles.CreateBody}>
        <div className={styles.headText}>즐길거리 새로 만들기</div>
        <div className={styles.Create_Container}>
          <div className={styles.Detail_Entire_Box}>
            <div className={styles.SImage_Box_Entire}>
              <div className={styles.SImage_Box}>
                <img src={previewURL} alt="미리보기" />
              </div>
              <label className={styles.inputFileLabel} htmlFor="inputFile">
                이미지 추가
                <input
                  className={styles.inputFile}
                  type="file"
                  id="inputFile"
                  accept="image/*"
                  onChange={handleImg}
                />
              </label>
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
                      placeholder="즐길거리 이름(공백포함 최대 30자까지 작성 가능합니다.)"
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
                      placeholder={`즐길거리에 대한 간략한 소개\n(공백포함 최대 100자까지 작성 가능합니다.)`}
                      onChange={(e) => setClubName(e.target.value)}
                      style={{ height: "6rem", width: "27rem" }}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>카테고리</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <select onChange={(e) => setCategory(e.target.value)}>
                      <option value="">선택</option>
                      <option value="밴드">밴드</option>
                      <option value="춤">춤</option>
                      <option value="아카펠라">아카펠라</option>
                      <option value="연극">연극</option>
                      <option value="힙합">힙합</option>
                      <option value="악기연주">악기연주</option>
                      <option value="기타">기타</option>
                    </select>
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>장소</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="text"
                      placeholder="진행 장소"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={{ width: "27rem" }}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>날짜</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div className={styles.form_detail_date_2}>
                      <input
                        id={styles.form_detail_date}
                        type="date"
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      ~
                      <input
                        id={styles.form_detail_date}
                        type="date"
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className={styles.smallInfo}>
                      하루만 진행할 경우 같은 날짜로 선택해주세요
                    </div>
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>시간</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <input
                      type="text"
                      placeholder={`시간 입력`}
                      style={{ width: "27rem" }}
                    />
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
                        style={{ width: "4.75rem" }}
                        onChange={(e) => setManager(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="연락처(전화번호 혹은 이메일)"
                        style={{ width: "21rem" }}
                        onChange={(e) => setManagerPhone(e.target.value)}
                      />
                    </div>
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>기타정보</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <textarea
                      type="text"
                      placeholder={`상세일정, 가격, 예약 방법 등 추가 정보 입력\n(공백 포함 최대 500자까지 입력 가능합니다.)`}
                      onChange={handleContent}
                      style={{ width: "27rem", height: "16rem" }}
                    />
                  </span>
                </div>
                <div className={styles.info_Box}>
                  <span className={styles.fixed_Info}>
                    <span className={styles.info_txt}>관련링크</span>
                  </span>
                  <span className={styles.variable_Info}>
                    <div className={styles.sns}>
                      <span className={styles.sns_icon}>
                        <img src={INSTA} alt="sns_icon" />
                      </span>
                      <span className={styles.variable_Info}>
                        <input
                          type="text"
                          placeholder="인스타그램 링크 입력"
                          style={{ width: "22rem" }}
                          className={styles.sns_link}
                          onChange={(e) => setInsta(e.target.value)}
                        ></input>
                      </span>
                    </div>
                    <div className={styles.sns}>
                      <span className={styles.sns_icon}>
                        <img src={KAKAO} alt="sns_icon" />
                      </span>
                      <span className={styles.variable_Info}>
                        <input
                          type="text"
                          placeholder="카카오톡 오픈채팅방 또는 채널 링크 입력"
                          style={{ width: "22rem" }}
                          className={styles.sns_link}
                          onChange={(e) => setKakao(e.target.value)}
                        ></input>
                      </span>
                    </div>
                    <div className={styles.sns}>
                      <span className={styles.sns_icon}>
                        <img src={YOUTUBE} alt="sns_icon" />
                      </span>
                      <span className={styles.variable_Info}>
                        <input
                          type="text"
                          placeholder="유튜브 링크 입력"
                          style={{ width: "22rem" }}
                          className={styles.sns_link}
                          onChange={(e) => setYoutube(e.target.value)}
                        ></input>
                      </span>
                    </div>
                    <div className={styles.sns}>
                      <span className={styles.sns_icon}>
                        <img src={NOTION} alt="sns_icon" />
                      </span>
                      <span className={styles.variable_Info}>
                        <input
                          type="text"
                          placeholder="노션(Notion) 링크 입력"
                          style={{ width: "22rem" }}
                          className={styles.sns_link}
                          onChange={(e) => setNotion(e.target.value)}
                        ></input>
                      </span>
                    </div>
                    <div className={styles.sns}>
                      <span className={styles.sns_icon}>
                        <img src={LINK} alt="sns_icon" />
                      </span>
                      <span className={styles.variable_Info}>
                        <input
                          type="text"
                          placeholder="구글 폼, 페이스북 등의 링크 입력"
                          style={{ width: "22rem" }}
                          className={styles.sns_link}
                          onChange={(e) => setLink(e.target.value)}
                        ></input>
                      </span>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button className={styles.make_show_submit} onClick={makeEntertain}>
              즐길거리 만들기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEntertain;
