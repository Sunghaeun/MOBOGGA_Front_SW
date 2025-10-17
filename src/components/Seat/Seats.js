import React, {useState, useEffect} from "react";
import styles from "./Seats.module.css";

import Seat from "./Seat";

import selected from "../../assets/seat/seatSelcted_26.svg";

function Seats({ seatTicket = [] , onSelectedSeatsChange }) {
  const [seats, setSeats] = useState([
    // row 1 (ids 1~12)
    { id: 1, row: 1, col: 1, reservation: 0, selected: 0 },
    { id: 2, row: 1, col: 2, reservation: 0, selected: 0 },
    { id: 3, row: 1, col: 3, reservation: 0, selected: 0 },
    { id: 4, row: 1, col: 4, reservation: 0, selected: 0 },
    { id: 5, row: 1, col: 5, reservation: 0, selected: 0 },
    { id: 6, row: 1, col: 6, reservation: 0, selected: 0 },
    { id: 7, row: 1, col: 7, reservation: 0, selected: 0 },
    { id: 8, row: 1, col: 8, reservation: 0, selected: 0 },
    { id: 9, row: 1, col: 9, reservation: 0, selected: 0 },
    { id: 10, row: 1, col: 10, reservation: 0, selected: 0 },
    { id: 11, row: 1, col: 11, reservation: 0, selected: 0 },
    { id: 12, row: 1, col: 12, reservation: 0, selected: 0 },

    // row 2 (ids 13~24)
    { id: 13, row: 2, col: 1, reservation: 0, selected: 0 },
    { id: 14, row: 2, col: 2, reservation: 0, selected: 0 },
    { id: 15, row: 2, col: 3, reservation: 0, selected: 0 },
    { id: 16, row: 2, col: 4, reservation: 0, selected: 0 },
    { id: 17, row: 2, col: 5, reservation: 0, selected: 0 },
    { id: 18, row: 2, col: 6, reservation: 0, selected: 0 },
    { id: 19, row: 2, col: 7, reservation: 0, selected: 0 },
    { id: 20, row: 2, col: 8, reservation: 0, selected: 0 },
    { id: 21, row: 2, col: 9, reservation: 0, selected: 0 },
    { id: 22, row: 2, col: 10, reservation: 0, selected: 0 },
    { id: 23, row: 2, col: 11, reservation: 0, selected: 0 },
    { id: 24, row: 2, col: 12, reservation: 0, selected: 0 },

    // row 3 (ids 25~36)
    { id: 25, row: 3, col: 1, reservation: 0, selected: 0 },
    { id: 26, row: 3, col: 2, reservation: 0, selected: 0 },
    { id: 27, row: 3, col: 3, reservation: 0, selected: 0 },
    { id: 28, row: 3, col: 4, reservation: 0, selected: 0 },
    { id: 29, row: 3, col: 5, reservation: 0, selected: 0 },
    { id: 30, row: 3, col: 6, reservation: 0, selected: 0 },
    { id: 31, row: 3, col: 7, reservation: 0, selected: 0 },
    { id: 32, row: 3, col: 8, reservation: 0, selected: 0 },
    { id: 33, row: 3, col: 9, reservation: 0, selected: 0 },
    { id: 34, row: 3, col: 10, reservation: 0, selected: 0 },
    { id: 35, row: 3, col: 11, reservation: 0, selected: 0 },
    { id: 36, row: 3, col: 12, reservation: 0, selected: 0 },

    // row 4 (ids 37~48)
    { id: 37, row: 4, col: 1, reservation: 0, selected: 0 },
    { id: 38, row: 4, col: 2, reservation: 0, selected: 0 },
    { id: 39, row: 4, col: 3, reservation: 0, selected: 0 },
    { id: 40, row: 4, col: 4, reservation: 0, selected: 0 },
    { id: 41, row: 4, col: 5, reservation: 0, selected: 0 },
    { id: 42, row: 4, col: 6, reservation: 0, selected: 0 },
    { id: 43, row: 4, col: 7, reservation: 0, selected: 0 },
    { id: 44, row: 4, col: 8, reservation: 0, selected: 0 },
    { id: 45, row: 4, col: 9, reservation: 0, selected: 0 },
    { id: 46, row: 4, col: 10, reservation: 0, selected: 0 },
    { id: 47, row: 4, col: 11, reservation: 0, selected: 0 },
    { id: 48, row: 4, col: 12, reservation: 0, selected: 0 },

    // row 5 (ids 49~60)
    { id: 49, row: 5, col: 1, reservation: 0, selected: 0 },
    { id: 50, row: 5, col: 2, reservation: 0, selected: 0 },
    { id: 51, row: 5, col: 3, reservation: 0, selected: 0 },
    { id: 52, row: 5, col: 4, reservation: 0, selected: 0 },
    { id: 53, row: 5, col: 5, reservation: 0, selected: 0 },
    { id: 54, row: 5, col: 6, reservation: 0, selected: 0 },
    { id: 55, row: 5, col: 7, reservation: 0, selected: 0 },
    { id: 56, row: 5, col: 8, reservation: 0, selected: 0 },
    { id: 57, row: 5, col: 9, reservation: 0, selected: 0 },
    { id: 58, row: 5, col: 10, reservation: 0, selected: 0 },
    { id: 59, row: 5, col: 11, reservation: 0, selected: 0 },
    { id: 60, row: 5, col: 12, reservation: 0, selected: 0 },

    // row 6 (ids 61~72)
    { id: 61, row: 6, col: 1, reservation: 0, selected: 0 },
    { id: 62, row: 6, col: 2, reservation: 0, selected: 0 },
    { id: 63, row: 6, col: 3, reservation: 0, selected: 0 },
    { id: 64, row: 6, col: 4, reservation: 0, selected: 0 },
    { id: 65, row: 6, col: 5, reservation: 0, selected: 0 },
    { id: 66, row: 6, col: 6, reservation: 0, selected: 0 },
    { id: 67, row: 6, col: 7, reservation: 0, selected: 0 },
    { id: 68, row: 6, col: 8, reservation: 0, selected: 0 },
    { id: 69, row: 6, col: 9, reservation: 0, selected: 0 },
    { id: 70, row: 6, col: 10, reservation: 0, selected: 0 },
    { id: 71, row: 6, col: 11, reservation: 0, selected: 0 },
    { id: 72, row: 6, col: 12, reservation: 0, selected: 0 },

    // row 7 (ids 73~84)
    { id: 73, row: 7, col: 1, reservation: 0, selected: 0 },
    { id: 74, row: 7, col: 2, reservation: 0, selected: 0 },
    { id: 75, row: 7, col: 3, reservation: 0, selected: 0 },
    { id: 76, row: 7, col: 4, reservation: 0, selected: 0 },
    { id: 77, row: 7, col: 5, reservation: 0, selected: 0 },
    { id: 78, row: 7, col: 6, reservation: 0, selected: 0 },
    { id: 79, row: 7, col: 7, reservation: 0, selected: 0 },
    { id: 80, row: 7, col: 8, reservation: 0, selected: 0 },
    { id: 81, row: 7, col: 9, reservation: 0, selected: 0 },
    { id: 82, row: 7, col: 10, reservation: 0, selected: 0 },
    { id: 83, row: 7, col: 11, reservation: 0, selected: 0 },
    { id: 84, row: 7, col: 12, reservation: 0, selected: 0 },

    // row 8 (ids 85~96)
    { id: 85, row: 8, col: 1, reservation: 0, selected: 0 },
    { id: 86, row: 8, col: 2, reservation: 0, selected: 0 },
    { id: 87, row: 8, col: 3, reservation: 0, selected: 0 },
    { id: 88, row: 8, col: 4, reservation: 0, selected: 0 },
    { id: 89, row: 8, col: 5, reservation: 0, selected: 0 },
    { id: 90, row: 8, col: 6, reservation: 0, selected: 0 },
    { id: 91, row: 8, col: 7, reservation: 0, selected: 0 },
    { id: 92, row: 8, col: 8, reservation: 0, selected: 0 },
    { id: 93, row: 8, col: 9, reservation: 0, selected: 0 },
    { id: 94, row: 8, col: 10, reservation: 0, selected: 0 },
    { id: 95, row: 8, col: 11, reservation: 0, selected: 0 },
    { id: 96, row: 8, col: 12, reservation: 0, selected: 0 },

    // row 9 (ids 97~108)
    { id: 97, row: 9, col: 1, reservation: 0, selected: 0 },
    { id: 98, row: 9, col: 2, reservation: 0, selected: 0 },
    { id: 99, row: 9, col: 3, reservation: 0, selected: 0 },
    { id: 100, row: 9, col: 4, reservation: 0, selected: 0 },
    { id: 101, row: 9, col: 5, reservation: 0, selected: 0 },
    { id: 102, row: 9, col: 6, reservation: 0, selected: 0 },
    { id: 103, row: 9, col: 7, reservation: 0, selected: 0 },
    { id: 104, row: 9, col: 8, reservation: 0, selected: 0 },
    { id: 105, row: 9, col: 9, reservation: 0, selected: 0 },
    { id: 106, row: 9, col: 10, reservation: 0, selected: 0 },
    { id: 107, row: 9, col: 11, reservation: 0, selected: 0 },
    { id: 108, row: 9, col: 12, reservation: 0, selected: 0 },

    // row 10 (ids 109~120)
    { id: 109, row: 10, col: 1, reservation: 0, selected: 0 },
    { id: 110, row: 10, col: 2, reservation: 0, selected: 0 },
    { id: 111, row: 10, col: 3, reservation: 0, selected: 0 },
    { id: 112, row: 10, col: 4, reservation: 0, selected: 0 },
    { id: 113, row: 10, col: 5, reservation: 0, selected: 0 },
    { id: 114, row: 10, col: 6, reservation: 0, selected: 0 },
    { id: 115, row: 10, col: 7, reservation: 0, selected: 0 },
    { id: 116, row: 10, col: 8, reservation: 0, selected: 0 },
    { id: 117, row: 10, col: 9, reservation: 0, selected: 0 },
    { id: 118, row: 10, col: 10, reservation: 0, selected: 0 },
    { id: 119, row: 10, col: 11, reservation: 0, selected: 0 },
    { id: 120, row: 10, col: 12, reservation: 0, selected: 0 },

    // row 11 (ids 121~132)
    { id: 121, row: 11, col: 1, reservation: 0, selected: 0 },
    { id: 122, row: 11, col: 2, reservation: 0, selected: 0 },
    { id: 123, row: 11, col: 3, reservation: 0, selected: 0 },
    { id: 124, row: 11, col: 4, reservation: 0, selected: 0 },
    { id: 125, row: 11, col: 5, reservation: 0, selected: 0 },
    { id: 126, row: 11, col: 6, reservation: 0, selected: 0 },
    { id: 127, row: 11, col: 7, reservation: 0, selected: 0 },
    { id: 128, row: 11, col: 8, reservation: 0, selected: 0 },
    { id: 129, row: 11, col: 9, reservation: 0, selected: 0 },
    { id: 130, row: 11, col: 10, reservation: 0, selected: 0 },
    { id: 131, row: 11, col: 11, reservation: 0, selected: 0 },
    { id: 132, row: 11, col: 12, reservation: 0, selected: 0 },

    // row 12 (ids 133~144)
    { id: 133, row: 12, col: 1, reservation: 0, selected: 0 },
    { id: 134, row: 12, col: 2, reservation: 0, selected: 0 },
    { id: 135, row: 12, col: 3, reservation: 0, selected: 0 },
    { id: 136, row: 12, col: 4, reservation: 0, selected: 0 },
    { id: 137, row: 12, col: 5, reservation: 0, selected: 0 },
    { id: 138, row: 12, col: 6, reservation: 0, selected: 0 },
    { id: 139, row: 12, col: 7, reservation: 0, selected: 0 },
    { id: 140, row: 12, col: 8, reservation: 0, selected: 0 },
    { id: 141, row: 12, col: 9, reservation: 0, selected: 0 },
    { id: 142, row: 12, col: 10, reservation: 0, selected: 0 },
    { id: 143, row: 12, col: 11, reservation: 0, selected: 0 },
    { id: 144, row: 12, col: 12, reservation: 0, selected: 0 }
  ]);

  const COLS = 12;         // 총 좌석 열 수
  const AISLE_AFTER = 6;   // 6열 뒤에 통로
  const SEAT_PX = 36;      // 좌석 한 칸 너비
  const AISLE_WIDTH = 28;  // 통로 너비 (원하는 값) 

  const gridTemplateColumns =
    `repeat(${AISLE_AFTER}, ${SEAT_PX}px) ${AISLE_WIDTH}px repeat(${COLS - AISLE_AFTER}, ${SEAT_PX}px)`;

  // 통로 뒤쪽 좌석은 컬럼을 1칸 밀어서 배치
  const colWithAisle = (col) => (col > AISLE_AFTER ? col + 1 : col);

  // eslint-disable-next-line
  const [selectedSeats, setSelectedSeats] = useState([]);

//   const handleSeatClick = (id) => {
//   setSeats(prev =>
//     prev.map(seat =>
//       seat.id === id
//         ? { ...seat, selected: seat.selected === 1 ? 0 : 1 }
//         : seat
//     )
//   );
// };

  const handleSeatClick = (id) => {
    setSeats(prev =>
      prev.map(seat =>
        seat.id === id
          ? { ...seat, selected: seat.selected === 1 ? 0 : 1 }
          : seat
      )
    );

    // 클릭 후 선택된 좌석 id 배열 추출
    const selectedIds = seats
      .map(seat => seat.id)
      .filter((seatId, idx) => {
        // 클릭한 좌석은 토글되므로, seats에서 selected가 1이거나 클릭한 id면 선택됨
        if (seatId === id) {
          // 클릭한 좌석은 토글되므로, 이전 상태와 반대
          const clickedSeat = seats.find(seat => seat.id === id);
          return clickedSeat.selected !== 1; // 토글
        }
        return seats.find(seat => seat.id === seatId).selected === 1;
      });

    if (onSelectedSeatsChange) {
      onSelectedSeatsChange(selectedIds);
    }
  };

  useEffect(() => {
    if (!seatTicket || seatTicket.length === 0) {
      setSeats(seats);
      setSelectedSeats([]);
      return;
    }
    setSeats(prev =>
      prev.map(seat =>
        seatTicket.includes(seat.id)
          ? { ...seat, reservation: 0 }
          : { ...seat, reservation: 1 }
      )
    );
    setSelectedSeats(seatTicket ?? []);
    // eslint-disable-next-line
  }, [seatTicket]);


  return (
    <>
      <div className={styles.main}>
        <div className={styles.row}>
          <div className={styles.column}>
            <span className={styles.stage}>Stage</span>
              <div
              className={styles.grid}
              style={{ gridTemplateColumns,  
              gridAutoRows: `${SEAT_PX}px`,  
              gap: 8 }}
              role="grid"
              aria-label="좌석 선택 영역"
            >
            {seats.map((seat) => (
              <div
                key={seat.id}
                style={{
                  gridRowStart: seat.row,
                  gridColumnStart: colWithAisle(seat.col) // <-- 통로 고려
                }}
              >
                <Seat
                  {...seat}
                  onClick={() => handleSeatClick(seat.id)}
                />
              </div>
            ))}
            </div>
          </div>
          

          <div className={styles.guide}>
            <div className={styles.seat}>
              <div className={styles.can}></div>
              <span>선택가능</span>
            </div>
            <div className={styles.seat}>
              <div className={styles.completed}></div>
              <span>선택완료</span>
            </div>
            <div className={styles.seat}>
              <img src={selected} alt="selected" />
              <span>선택불가</span>
            </div>
          </div>
        </div>

        
      </div>
    </>
  );
}

export default Seats;