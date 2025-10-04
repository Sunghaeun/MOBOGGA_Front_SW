import React,{useState} from "react";
import styles from "./styles/SeatTest.module.css";

import Seats from "../components/Seat/Seats";
import SeatModal from "../components/Seat/SeatModal";

function SeatTest() {
  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const openSeatModal = () => setSeatModalOpen(true);
  const closeSeatModal = () => {
    setSeatModalOpen(false);
    document.body.style.removeProperty("overflow");
  };

  return (
    <>
      <div className={styles.main}>
        <button onClick={openSeatModal}>test</button>
        <Seats />
      </div>
      <SeatModal open={seatModalOpen} close={closeSeatModal} />
    </>
  );
}

export default SeatTest;