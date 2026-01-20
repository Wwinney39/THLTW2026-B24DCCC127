import React, { useState } from 'react';
import { Table, Input, Card, Button, Popconfirm, message } from 'antd';
import { useModel } from 'umi';
import { DeleteOutlined } from '@ant-design/icons';

const DanhSachSanPham = () => {
	const { listProduct, deleteProduct } = useModel('sanpham');
	const [searchText, setSearchText] = useState('');

	const dataSource = listProduct.filter((item: any) => item.name.toLowerCase().includes(searchText.toLowerCase()));

	const columns = [
		{
			title: 'STT',
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			render: (v: number) => v.toLocaleString('vi-VN'),
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
		},
		{
			title: 'Thao tác',
			render: (_: any, record: any) => (
				<Popconfirm
					title='Bạn có chắc chắn xóa sản phẩm này không?'
					onConfirm={() => deleteProduct(record.id)}
					okText='Có'
					cancelText='Không'
				>
					<Button type='primary' danger icon={<DeleteOutlined />}>
						Xóa
					</Button>
				</Popconfirm>
			),
		},
	];

	return (
		<Card title='Quản lý sản phẩm'>
			<Input.Search
				placeholder='Tìm kiếm...'
				onChange={(e) => setSearchText(e.target.value)}
				style={{ marginBottom: 16, width: 300 }}
				allowClear
			/>

			<Table dataSource={dataSource} columns={columns} rowKey='id' />
		</Card>
	);
};

export default DanhSachSanPham;
