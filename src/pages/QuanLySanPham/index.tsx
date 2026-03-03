import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Card, message, Popconfirm } from 'antd';
import { useModel } from 'umi';
import { Product } from '@/models/sanpham';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const ProductAdmin = () => {
	// Lấy đúng tên biến 'listProduct' và các hàm từ model sanpham
	const { listProduct, addProduct, updateProduct, deleteProduct } = useModel('sanpham');

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [form] = Form.useForm();

	const showAddModal = () => {
		setEditingProduct(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const handleEdit = (record: Product) => {
		setEditingProduct(record);
		form.setFieldsValue(record);
		setIsModalOpen(true);
	};

	const handleSave = (values: any) => {
		if (editingProduct) {
			// Gọi hàm updateProduct từ model
			updateProduct(editingProduct.id, values);
			message.success('Cập nhật thành công!');
		} else {
			// Gọi hàm addProduct từ model
			addProduct(values);
			message.success('Thêm sản phẩm mới thành công!');
		}
		setIsModalOpen(false);
	};

	const columns = [
		{
			title: 'Mã SP',
			dataIndex: 'id',
			key: 'id',
			render: (id: number) => {
				return id > 10000 ? `SP${String(id).slice(-4)}` : `SP00${id}`;
			},
		},
		{ title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
		{ title: 'Danh mục', dataIndex: 'category', key: 'category' },
		{
			title: 'Giá',
			dataIndex: 'price',
			render: (val: number) => `${val?.toLocaleString()}đ`,
		},
		{ title: 'Số lượng tồn', dataIndex: 'quantity', key: 'quantity' },
		{
			title: 'Thao tác',
			render: (_: any, record: Product) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa sản phẩm này?'
						onConfirm={() => {
							deleteProduct(record.id);
							message.success('Đã xóa sản phẩm');
						}}
						okText='Có'
						cancelText='Không'
					>
						<Button icon={<DeleteOutlined />} danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<Card
				title='Quản trị Hệ thống Sản phẩm'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={showAddModal}>
						Thêm sản phẩm
					</Button>
				}
			>
				<Table columns={columns} dataSource={listProduct} rowKey='id' />

				<Modal
					title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
					visible={isModalOpen}
					okText='Có'
					cancelText='Không'
					onOk={() => form.submit()}
					onCancel={() => setIsModalOpen(false)}
					destroyOnClose
				>
					<Form form={form} layout='vertical' onFinish={handleSave}>
						<Form.Item name='name' label='Tên sản phẩm' rules={[{ required: true }]}>
							<Input />
						</Form.Item>
						<Form.Item name='category' label='Danh mục' rules={[{ required: true }]}>
							<Input placeholder='Ví dụ: Laptop, Điện thoại...' />
						</Form.Item>
						<Form.Item name='price' label='Giá' rules={[{ required: true }]}>
							<InputNumber
								style={{ width: '100%' }}
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							/>
						</Form.Item>
						<Form.Item name='quantity' label='Số lượng tồn kho' rules={[{ required: true }]}>
							<InputNumber min={0} style={{ width: '100%' }} />
						</Form.Item>
					</Form>
				</Modal>
			</Card>
		</div>
	);
};

export default ProductAdmin;
