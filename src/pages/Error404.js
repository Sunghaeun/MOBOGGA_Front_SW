function Error404() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#f8f8f8"
    }}>
      <h1 style={{ fontSize: "5rem", margin: 0, color: "#888" }}>404</h1>
      <p style={{ fontSize: "1.5rem", color: "#555" }}>
        페이지를 찾을 수 없습니다.
      </p>
      <a
        href="/"
        style={{
          marginTop: "2rem",
          color: "#1976d2",
          textDecoration: "underline",
          fontSize: "1.1rem"
        }}
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}

export default Error404;