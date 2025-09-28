import React from "react";
import styles from "./styles/SeatTest.module.css";

import Seats from "../components/Seat/Seats";

function SeatTest() {
  return (
    <>
      <div className={styles.main}>
        <Seats />
      </div>
    </>
  );
}

export default SeatTest;