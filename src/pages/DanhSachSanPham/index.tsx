import React, { useState } from 'react';
import { Table, Input, Card, Button, Popconfirm, Tag, Space } from 'antd';
import { useModel } from 'umi';
import { SearchOutlined, BoxPlotOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';

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
			title: 'Trạng thái',
			dataIndex: 'quantity',
			key: 'quantity',
			render: (quantity: number) => {
				if (quantity === 0) return <Tag color='red'>Hết hàng</Tag>;
				if (quantity >= 1 && quantity <= 10) return <Tag color='orange'>Sắp hết hàng</Tag>;
				return <Tag color='green'>Còn hàng</Tag>;
			},
		},
		{
			title: 'Thao tác',
			render: (_: any, record: any) => (
				<Space size='middle'>
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

					<Button type='link' onClick={() => handleEdit(record.id)} style={{ marginLeft: 8 }}>
						Sửa
					</Button>
				</Space>
			),
		},
	];

	return (
		<Card title='Danh sách sản phẩm'>
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
