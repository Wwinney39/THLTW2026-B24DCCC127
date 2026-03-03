import { useState } from 'react';
const initialDataMau = [
	{
		id: 'DH001',
		customerName: 'Nguyễn Văn A',
		phone: '0912345678',
		address: '123 Nguyễn Huệ, Q1, TP.HCM',
		products: [{ productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }],
		totalAmount: 25000000,
		status: 'Chờ xử lý',
		createdAt: '2024-01-15',
	},
];
export default () => {
	const [listDonHangMau, setListDonHangMau] = useState(initialDataMau);

	const addDonHangMau = (values: any) => {
		setListDonHangMau([...listDonHangMau, { id: `DH${Date.now()}`, ...values }]);
	};
	const deleteDonHangMau = (id: string) => {
		setListDonHangMau(listDonHangMau.filter((item) => item.id !== id));
	};
	return {
		listDonHangMau,
		addDonHangMau,
		deleteDonHangMau,
	};
};
export type TrangThai = 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
