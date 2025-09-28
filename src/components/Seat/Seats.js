import React, {useState, useEffect} from "react";
import styles from "./Seats.module.css";

import Seat from "./Seat";

function Seats() {
  const [seats, setSeats] = useState([
    { id: 1,  row: 1, col: 1, reservation: 0, selected: 0 },
    { id: 2,  row: 1, col: 2, reservation: 1, selected: 0 },
    { id: 3,  row: 1, col: 3, reservation: 0, selected: 0 },
    { id: 4,  row: 1, col: 4, reservation: 1, selected: 0 },
    { id: 5,  row: 1, col: 5, reservation: 0, selected: 0 },
    { id: 6,  row: 1, col: 6, reservation: 0, selected: 0 },
    { id: 7,  row: 1, col: 7, reservation: 1, selected: 0 },
    { id: 8,  row: 1, col: 8, reservation: 0, selected: 0 },
    { id: 9,  row: 2, col: 1, reservation: 1, selected: 0 },
    { id: 10, row: 2, col: 2, reservation: 0, selected: 0 },
    { id: 11, row: 2, col: 3, reservation: 1, selected: 0 },
    { id: 12, row: 2, col: 4, reservation: 0, selected: 0 },
    { id: 13, row: 2, col: 5, reservation: 0, selected: 0 },
    { id: 14, row: 2, col: 6, reservation: 1, selected: 0 },
    { id: 15, row: 2, col: 7, reservation: 0, selected: 0 },
    { id: 16, row: 2, col: 8, reservation: 1, selected: 0 },
    { id: 17, row: 3, col: 1, reservation: 0, selected: 0 },
    { id: 18, row: 3, col: 2, reservation: 1, selected: 0 },
    { id: 19, row: 3, col: 3, reservation: 0, selected: 0 },
    { id: 20, row: 3, col: 4, reservation: 0, selected: 0 },
    { id: 21, row: 3, col: 5, reservation: 1, selected: 0 },
    { id: 22, row: 3, col: 6, reservation: 0, selected: 0 },
    { id: 23, row: 3, col: 7, reservation: 1, selected: 0 },
    { id: 24, row: 3, col: 8, reservation: 0, selected: 0 },
    { id: 25, row: 4, col: 1, reservation: 1, selected: 0 },
    { id: 26, row: 4, col: 2, reservation: 0, selected: 0 },
    { id: 27, row: 4, col: 3, reservation: 0, selected: 0 },
    { id: 28, row: 4, col: 4, reservation: 1, selected: 0 },
    { id: 29, row: 4, col: 5, reservation: 0, selected: 0 },
    { id: 30, row: 4, col: 6, reservation: 1, selected: 0 },
    { id: 31, row: 4, col: 7, reservation: 0, selected: 0 },
    { id: 32, row: 4, col: 8, reservation: 1, selected: 0 },
    { id: 33, row: 5, col: 1, reservation: 0, selected: 0 },
    { id: 34, row: 5, col: 2, reservation: 1, selected: 0 },
    { id: 35, row: 5, col: 3, reservation: 0, selected: 0 },
    { id: 36, row: 5, col: 4, reservation: 0, selected: 0 },
    { id: 37, row: 5, col: 5, reservation: 1, selected: 0 },
    { id: 38, row: 5, col: 6, reservation: 0, selected: 0 },
    { id: 39, row: 5, col: 7, reservation: 0, selected: 0 },
    { id: 40, row: 5, col: 8, reservation: 1, selected: 0 }
  ]);

  const maxCol = Math.max(...seats.map(s => s.col));

  const handleSeatClick = (id) => {
    setSeats(prev =>
      prev.map(seat =>
        seat.id === id
          ? { ...seat, selected: seat.selected === 1 ? 0 : 1 }
          : seat
      )
    );
  };

  useEffect(() => {
    console.log('updated seats:', seats); // ← 상태가 실제로 바뀐 뒤에 찍힘
  }, [seats]);

  return (
    <>
      <div className={styles.main}>
        <h3>Seats Page</h3>
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${maxCol}, 40px)` }}
        role="grid"
        aria-label="좌석 선택 영역"
      >
        {seats.map((seat) => (
          <div
            key={seat.id}
            style={{ gridRowStart: seat.row, gridColumnStart: seat.col }}
          >
            <Seat
              {...seat}
              onClick={() => handleSeatClick(seat.id)}
            />
          </div>
        ))}
      </div>
      </div>
    </>
  );
}

export default Seats;