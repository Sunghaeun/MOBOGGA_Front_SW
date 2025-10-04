export const ROWS = 12;
export const COLS = 12;

// id(1..ROWS*COLS) -> {row, col}
export function idToRowCol(id, cols = COLS) {
  if (!Number.isInteger(id) || id < 1 || id > ROWS * cols) return null;
  const row = Math.ceil(id / cols);
  const col = ((id - 1) % cols) + 1;
  return { row, col };
}

// {row, col} -> id
export function rowColToId(row, col, cols = COLS) {
  if (row < 1 || row > ROWS || col < 1 || col > cols) return null;
  return (row - 1) * cols + col;
}

// 행번호(1..26) <-> 행라벨(A..Z)
export const rowToLabel = (row) => String.fromCharCode(64 + row);
export const labelToRow = (label) => {
  const upper = String(label).trim().toUpperCase();
  if (!/^[A-Z]$/.test(upper)) return null;
  return upper.charCodeAt(0) - 64;
};

// id -> "A2" 형태로 변환할 때 쓰는 함수
// 1) 한개일때는
// idToCode(14); 이렇게 사용, seatTest 참고

// 2) 여러개일때는
// selectedSeatIds 배열 안에 인덱스번호가 들어있을 때
// const selectedSeatCodes = useMemo(
//     () => selectedSeatIds.map((id) => idToCode(id)).filter(Boolean),
//     [selectedSeatIds]
//   );
// 이래쓰면 selectedSeatCodes 배열 안에 "A2" 형태로 변환된 좌석번호들이 들어있을거 !

export function idToCode(id, cols = COLS) {
  const rc = idToRowCol(id, cols);
  if (!rc) return null;
  return `${rowToLabel(rc.row)}${rc.col}`;
}

// "A2"/"d5" -> id
// codeToId("d5"); 이렇게 사용, seatTest 참고
export function codeToId(code, cols = COLS) {
  const m = String(code).trim().toUpperCase().match(/^([A-Z])\s*(\d{1,2})$/);
  if (!m) return null;
  const row = labelToRow(m[1]);
  const col = parseInt(m[2], 10);
  return rowColToId(row, col, cols);
}

