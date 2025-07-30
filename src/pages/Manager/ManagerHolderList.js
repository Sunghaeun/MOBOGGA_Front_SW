import React from "react";
import styles from "./styles/ManagerHolderList.module.css";
import TrashDefault from "../../assets/icons/trash_default.svg";

const dummyData = [
	{
		id: 1,
		date: "2025.04.11",
		name: "김ㅇㅇ",
		stdId: "21901234",
		phone: "010-1234-1234",
		count: 1,
		price: 5000,
		status: "미입금",
		cancel: false,
	},
	{
		id: 2,
		date: "2025.04.11",
		name: "박ㅇㅇ",
		stdId: "21905678",
		phone: "010-5678-1234",
		count: 2,
		price: 10000,
		status: "입금완료",
		cancel: false,
	},
	{
		id: 3,
		date: "2025.04.11",
		name: "이ㅇㅇ",
		stdId: "22001234",
		phone: "010-2222-3333",
		count: 1,
		price: 5000,
		status: "미입금",
		cancel: false,
	},
	{
		id: 4,
		date: "2025.04.11",
		name: "최ㅇㅇ",
		stdId: "22104567",
		phone: "010-4444-5555",
		count: 1,
		price: 5000,
		status: "입금완료",
		cancel: true,
	},
	{
		id: 5,
		date: "2025.04.11",
		name: "정ㅇㅇ",
		stdId: "21807654",
		phone: "010-6666-7777",
		count: 3,
		price: 15000,
		status: "취소요청",
		cancel: true,
	},
	{
		id: 6,
		date: "2025.04.11",
		name: "오ㅇㅇ",
		stdId: "21709876",
		phone: "010-8888-9999",
		count: 1,
		price: 5000,
		status: "미입금",
		cancel: false,
	},
	{
		id: 7,
		date: "2025.04.11",
		name: "유ㅇㅇ",
		stdId: "21901111",
		phone: "010-1111-2222",
		count: 2,
		price: 10000,
		status: "입금완료",
		cancel: false,
	},
	{
		id: 8,
		date: "2025.04.11",
		name: "문ㅇㅇ",
		stdId: "22002222",
		phone: "010-3333-4444",
		count: 1,
		price: 5000,
		status: "미입금",
		cancel: false,
	},
	{
		id: 9,
		date: "2025.04.11",
		name: "장ㅇㅇ",
		stdId: "22103333",
		phone: "010-5555-6666",
		count: 1,
		price: 5000,
		status: "입금완료",
		cancel: false,
	},
	{
		id: 10,
		date: "2025.04.11",
		name: "한ㅇㅇ",
		stdId: "21804444",
		phone: "010-7777-8888",
		count: 1,
		price: 5000,
		status: "미입금",
		cancel: false,
	},
	// ...더미 데이터 반복 (실제 데이터로 교체)
];

function ManagerHolderList() {
	return (
		<div className={styles.wrapper}>
			<div className={styles.title}>2025 MIC 자체공연 1공</div>
			<div className={styles.toolbar}>
				<button className={styles.csvBtn}>CSV 추출</button>
				<button className={styles.selectBtn}>선택 일괄 처리 ▼</button>
				<button className={styles.deleteBtn}>선택 삭제</button>
			</div>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>
							<input type="checkbox" />
						</th>
						<th>예매일자</th>
						<th>이름</th>
						<th>학번</th>
						<th>전화번호</th>
						<th>매수</th>
						<th>가격</th>
						<th>입금상태</th>
						<th>취소요청</th>
					</tr>
				</thead>
				<tbody>
					{dummyData.map((row) => (
						<tr key={row.id}>
							<td>
								<input type="checkbox" />
							</td>
							<td>{row.date}</td>
							<td>{row.name}</td>
							<td>{row.stdId}</td>
							<td>{row.phone}</td>
							<td>{row.count}</td>
							<td>{row.price.toLocaleString()}</td>
							<td>
								<span
									className={
										row.status === "입금완료"
											? styles.statusPaid
											: row.status === "미입금"
											? styles.statusUnpaid
											: styles.statusCancel
									}
								>
									{row.status}
								</span>
							</td>
							<td>
								{row.cancel ? (
									<button className={styles.cancelBtn}>
										<img
											src={TrashDefault}
											alt="삭제"
											style={{ width: 20, height: 20 }}
										/>
									</button>
								) : (
									"-"
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default ManagerHolderList;