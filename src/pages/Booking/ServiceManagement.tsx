import React from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Service } from '@/models/databooking';

interface Props {
	services: Service[];
	setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}

const ServiceManagement: React.FC<Props> = ({ services, setServices }) => {
	const [form] = Form.useForm();
	const [modalOpen, setModalOpen] = React.useState(false);
	const [editing, setEditing] = React.useState<Service | null>(null);

	// Tạo ID đơn giản (timestamp + random nhỏ)
	const generateId = (): number => {
		return Date.now() + Math.floor(Math.random() * 100);
	};

	const openModal = (service?: Service) => {
		setEditing(service || null);
		if (service) {
			form.setFieldsValue(service);
		} else {
			form.resetFields();
		}
		setModalOpen(true);
	};

	const handleSave = () => {
		form
			.validateFields()
			.then((values) => {
				if (editing) {
					// Cập nhật dịch vụ hiện có
					setServices((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...values } : s)));
					message.success('Cập nhật dịch vụ thành công');
				} else {
					// Thêm mới
					const newService: Service = {
						...values,
						id: generateId(),
					};
					setServices((prev) => [...prev, newService]);
					message.success('Thêm dịch vụ thành công');
				}
				setModalOpen(false);
				form.resetFields();
			})
			.catch(() => {
				// validation fail → không cần xử lý thêm
			});
	};

	const handleDelete = (id: number) => {
		setServices((prev) => prev.filter((s) => s.id !== id));
		message.success('Xóa dịch vụ thành công');
	};

	const columns = [
		{
			title: 'Tên dịch vụ',
			dataIndex: 'name',
			key: 'name',
			width: '40%',
		},
		{
			title: 'Giá (₫)',
			dataIndex: 'price',
			key: 'price',
			width: '20%',
			render: (value: number) => value.toLocaleString('vi-VN'),
			sorter: (a: Service, b: Service) => a.price - b.price,
		},
		{
			title: 'Thời gian (phút)',
			dataIndex: 'duration',
			key: 'duration',
			width: '15%',
			sorter: (a: Service, b: Service) => a.duration - b.duration,
		},
		{
			title: 'Hành động',
			key: 'action',
			width: '25%',
			render: (_: any, record: Service) => (
				<Space size='middle'>
					<Button type='text' icon={<EditOutlined />} onClick={() => openModal(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc muốn xóa dịch vụ này? Lịch hẹn liên quan có thể bị ảnh hưởng.'
						onConfirm={() => handleDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
						okButtonProps={{ danger: true }}
					>
						<Button type='text' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Button type='primary' icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 16 }}>
				Thêm dịch vụ mới
			</Button>

			<Table
				dataSource={services}
				columns={columns}
				rowKey='id'
				pagination={{ pageSize: 10, showSizeChanger: true }}
				locale={{ emptyText: 'Chưa có dịch vụ nào' }}
			/>

			<Modal
				title={editing ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
				open={modalOpen}
				onOk={handleSave}
				onCancel={() => {
					setModalOpen(false);
					form.resetFields();
				}}
				okText={editing ? 'Cập nhật' : 'Thêm'}
				cancelText='Hủy'
				width={500}
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='name'
						label='Tên dịch vụ'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên dịch vụ' },
							{ min: 3, message: 'Tên dịch vụ phải có ít nhất 3 ký tự' },
						]}
					>
						<Input placeholder='Ví dụ: Cắt tóc nam cơ bản' />
					</Form.Item>

					<Form.Item
						name='price'
						label='Giá (VND)'
						rules={[
							{ required: true, message: 'Vui lòng nhập giá' },
							{ type: 'number', min: 10000, message: 'Giá phải lớn hơn hoặc bằng 10.000 ₫' },
						]}
					>
						<Input type='number' min={10000} placeholder='150000' />
					</Form.Item>

					<Form.Item
						name='duration'
						label='Thời gian thực hiện (phút)'
						rules={[
							{ required: true, message: 'Vui lòng nhập thời gian' },
							{ type: 'number', min: 5, message: 'Thời gian tối thiểu 5 phút' },
							{ type: 'number', max: 480, message: 'Thời gian tối đa 480 phút (8 giờ)' },
						]}
					>
						<Input type='number' min={5} max={480} placeholder='60' />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default ServiceManagement;
