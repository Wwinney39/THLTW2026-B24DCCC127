import React from 'react';
import { Table, Button, Modal, Form, Input, TimePicker, message, Space, Popconfirm, Rate } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Staff, Appointment } from '@/models/databooking';

interface Props {
	staffs: Staff[];
	setStaffs: React.Dispatch<React.SetStateAction<Staff[]>>;
	appointments: Appointment[];
}

const StaffManagement: React.FC<Props> = ({ staffs, setStaffs, appointments }) => {
	const [form] = Form.useForm();
	const [modalOpen, setModalOpen] = React.useState(false);
	const [editing, setEditing] = React.useState<Staff | null>(null);

	// Tạo ID đơn giản (number)
	const generateId = (): number => {
		return Date.now() + Math.floor(Math.random() * 100);
	};

	const openModal = (staff?: Staff) => {
		setEditing(staff || null);
		if (staff) {
			form.setFieldsValue({
				name: staff.name,
				workStart: staff.workStart ? dayjs(staff.workStart, 'HH:mm') : undefined,
				workEnd: staff.workEnd ? dayjs(staff.workEnd, 'HH:mm') : undefined,
				maxCustomersPerDay: staff.maxCustomersPerDay,
			});
		} else {
			form.resetFields();
		}
		setModalOpen(true);
	};

	const handleSave = () => {
		form
			.validateFields()
			.then((values) => {
				// Chuyển Dayjs về string HH:mm
				const formattedValues = {
					...values,
					workStart: values.workStart?.format('HH:mm'),
					workEnd: values.workEnd?.format('HH:mm'),
				};

				if (editing) {
					setStaffs((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...formattedValues } : s)));
					message.success('Cập nhật nhân viên thành công');
				} else {
					const newStaff: Staff = {
						...formattedValues,
						id: generateId(),
					};
					setStaffs((prev) => [...prev, newStaff]);
					message.success('Thêm nhân viên thành công');
				}
				setModalOpen(false);
			})
			.catch(() => {});
	};

	const handleDelete = (id: number) => {
		// Kiểm tra có lịch hẹn đang active (pending/confirmed)
		const hasAppointments = appointments.some(
			(appt) => appt.staffId === id && (appt.status === 'pending' || appt.status === 'confirmed')
		);
		if (hasAppointments) {
			message.warning('Nhân viên này còn lịch hẹn đang hoạt động. Không thể xóa ngay.');
			return;
		}

		setStaffs((prev) => prev.filter((s) => s.id !== id));
		message.success('Xóa nhân viên thành công');
	};

	// Tính trung bình đánh giá (giả sử Appointment có field rating?: number)
	const getAverageRating = (staffId: number): number => {
		const staffAppts = appointments.filter((appt) => appt.staffId === staffId && typeof appt.rating === 'number');
		if (staffAppts.length === 0) return 0;

		const sum = staffAppts.reduce((acc, appt) => acc + (appt.rating || 0), 0);
		return Number((sum / staffAppts.length).toFixed(1));
	};

	const columns = [
		{
			title: 'Tên',
			dataIndex: 'name',
			key: 'name',
			sorter: (a: Staff, b: Staff) => a.name.localeCompare(b.name),
		},
		{
			title: 'Bắt đầu',
			dataIndex: 'workStart',
			key: 'workStart',
			width: 120,
		},
		{
			title: 'Kết thúc',
			dataIndex: 'workEnd',
			key: 'workEnd',
			width: 120,
		},
		{
			title: 'Tối đa khách/ngày',
			dataIndex: 'maxCustomersPerDay',
			key: 'max',
			width: 140,
			sorter: (a: Staff, b: Staff) => a.maxCustomersPerDay - b.maxCustomersPerDay,
		},
		{
			title: 'Đánh giá TB',
			key: 'rating',
			width: 140,
			render: (_: any, record: Staff) => {
				const avg = getAverageRating(record.id);
				return avg > 0 ? <Rate disabled allowHalf value={avg} /> : <span style={{ color: '#888' }}>Chưa có</span>;
			},
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 180,
			render: (_: any, record: Staff) => {
				const hasActiveAppointments = appointments.some(
					(a) => a.staffId === record.id && (a.status === 'pending' || a.status === 'confirmed')
				);

				return (
					<Space size='middle'>
						<Button type='text' icon={<EditOutlined />} onClick={() => openModal(record)}>
							Sửa
						</Button>
						<Popconfirm
							title={
								hasActiveAppointments
									? 'Nhân viên này có lịch hẹn đang hoạt động. Vui lòng hủy lịch trước khi xóa.'
									: 'Bạn có chắc muốn xóa nhân viên này?'
							}
							onConfirm={() => handleDelete(record.id)}
							okText='Xóa'
							cancelText='Hủy'
							okButtonProps={{
								danger: true,
								disabled: hasActiveAppointments,
							}}
						>
							<Button type='text' danger icon={<DeleteOutlined />}>
								Xóa
							</Button>
						</Popconfirm>
					</Space>
				);
			},
		},
	];

	return (
		<>
			<Button type='primary' icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 16 }}>
				Thêm nhân viên mới
			</Button>

			<Table
				dataSource={staffs}
				columns={columns}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				locale={{ emptyText: 'Chưa có nhân viên nào' }}
			/>

			<Modal
				title={editing ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
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
						label='Tên nhân viên'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên nhân viên' },
							{ min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
						]}
					>
						<Input placeholder='Ví dụ: Nguyễn Văn A' />
					</Form.Item>

					<Form.Item
						name='workStart'
						label='Giờ bắt đầu ca làm'
						rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
					>
						<TimePicker format='HH:mm' minuteStep={15} style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name='workEnd'
						label='Giờ kết thúc ca làm'
						rules={[
							{ required: true, message: 'Vui lòng chọn giờ kết thúc' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || !getFieldValue('workStart')) {
										return Promise.resolve();
									}
									if (value.isAfter(getFieldValue('workStart'))) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('Giờ kết thúc phải sau giờ bắt đầu'));
								},
							}),
						]}
					>
						<TimePicker format='HH:mm' minuteStep={15} style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name='maxCustomersPerDay'
						label='Số khách tối đa trong ngày'
						rules={[
							{ required: true, message: 'Vui lòng nhập số khách tối đa' },
							{ type: 'number', min: 1, message: 'Phải lớn hơn hoặc bằng 1' },
						]}
					>
						<Input type='number' min={1} placeholder='Ví dụ: 10' />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default StaffManagement;
