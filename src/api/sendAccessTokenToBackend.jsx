// src/api/sendAccessTokenToBackend.js
import axios from "axios";

const sendAccessTokenToBackend = async (idToken, navigate) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/oauth/google/session`,
      { credential: idToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // 쿠키 필요시
      }
    );
    console.log("Response from backend:", response.data);

    const jwt = response.data.token;
    localStorage.setItem("jwt", jwt); // 저장 후 라우팅
    console.log("Login successful, JWT stored:", jwt);

    const isFirst = response.data.first;
    if (isFirst) {
      navigate("/add-info");
      return;
    } else {
      navigate("/main");
    }
  } catch (error) {
    console.error("Login failed with error: ", error);
    throw error;
  }
};

export default sendAccessTokenToBackend;
