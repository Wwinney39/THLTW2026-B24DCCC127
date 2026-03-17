// Quản lý danh sách lịch hẹn + cập nhật trạng thái + đánh giá + phản hồi
import React from 'react';
import { Table, Select, Button, Modal, Form, Rate, Input, Tag, Space, message } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import type { Staff, Service, Appointment } from '@/models/databooking';

const { Option } = Select;
const { TextArea } = Input;

interface Props {
	appointments: Appointment[];
	setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
	services: Service[];
	staffs: Staff[];
}

const AppointmentList: React.FC<Props> = ({ appointments, setAppointments, services, staffs }) => {
	const [rateForm] = Form.useForm();
	const [replyForm] = Form.useForm();
	const [rateModal, setRateModal] = React.useState(false);
	const [replyModal, setReplyModal] = React.useState(false);
	const [selectedAppt, setSelectedAppt] = React.useState<Appointment | null>(null);

	const updateStatus = (id: number, status: Appointment['status']) => {
		setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
		message.success('Cập nhật trạng thái thành công');
	};

	const openRate = (appt: Appointment) => {
		if (appt.status !== 'completed') {
			message.warning('Chỉ đánh giá khi đã HOÀN THÀNH');
			return;
		}
		setSelectedAppt(appt);
		rateForm.setFieldsValue({ rating: appt.rating ?? 5, review: appt.review ?? '' });
		setRateModal(true);
	};

	const handleRate = () => {
		rateForm.validateFields().then((values) => {
			setAppointments((prev) =>
				prev.map((a) => (a.id === selectedAppt!.id ? { ...a, rating: values.rating, review: values.review } : a)),
			);
			message.success('Đánh giá đã lưu');
			setRateModal(false);
		});
	};

	const openReply = (appt: Appointment) => {
		setSelectedAppt(appt);
		replyForm.setFieldsValue({ reply: appt.reply ?? '' });
		setReplyModal(true);
	};

	const handleReply = () => {
		replyForm.validateFields().then((values) => {
			setAppointments((prev) => prev.map((a) => (a.id === selectedAppt!.id ? { ...a, reply: values.reply } : a)));
			message.success('Phản hồi đã gửi');
			setReplyModal(false);
		});
	};

	const columns = [
		{ title: 'Khách', dataIndex: 'customerName', key: 'customer' },
		{
			title: 'Dịch vụ',
			render: (_: any, r: Appointment) => services.find((s) => s.id === r.serviceId)?.name ?? '-',
		},
		{
			title: 'Nhân viên',
			render: (_: any, r: Appointment) => staffs.find((s) => s.id === r.staffId)?.name ?? '-',
		},
		{ title: 'Ngày', dataIndex: 'date' },
		{ title: 'Giờ', render: (_: any, r: Appointment) => `${r.startTime} - ${r.endTime}` },
		{
			title: 'Trạng thái',
			render: (_: any, r: Appointment) => {
				const colors = { pending: 'default', confirmed: 'blue', completed: 'green', canceled: 'red' };
				return <Tag color={colors[r.status]}>{r.status.toUpperCase()}</Tag>;
			},
		},
		{
			title: 'Hành động',
			render: (_: any, record: Appointment) => (
				<Space size='small' wrap>
					<Select
						value={record.status}
						style={{ width: 130 }}
						onChange={(v) => updateStatus(record.id, v as Appointment['status'])}
					>
						<Option value='pending'>Chờ duyệt</Option>
						<Option value='confirmed'>Xác nhận</Option>
						<Option value='completed'>Hoàn thành</Option>
						<Option value='canceled'>Hủy</Option>
					</Select>

					{record.status === 'completed' && (
						<Button icon={<StarOutlined />} onClick={() => openRate(record)}>
							Đánh giá
						</Button>
					)}

					{record.rating !== undefined && <Button onClick={() => openReply(record)}>Phản hồi</Button>}
				</Space>
			),
		},
	];

	return (
		<>
			<Table
				dataSource={[...(appointments || []).sort((a, b) => b.date.localeCompare(a.date))]}
				columns={columns}
				rowKey='id'
				pagination={{ pageSize: 10 }}
			/>

			{/* Modal đánh giá */}
			<Modal
				title='Đánh giá dịch vụ'
				open={rateModal}
				onOk={handleRate}
				onCancel={() => setRateModal(false)}
				okText='Gửi'
			>
				<Form form={rateForm} layout='vertical'>
					<Form.Item name='rating' label='Sao' rules={[{ required: true }]}>
						<Rate />
					</Form.Item>
					<Form.Item name='review' label='Nhận xét'>
						<TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>

			{/* Modal phản hồi */}
			<Modal
				title='Phản hồi đánh giá'
				open={replyModal}
				onOk={handleReply}
				onCancel={() => setReplyModal(false)}
				okText='Gửi'
			>
				<Form form={replyForm} layout='vertical'>
					<Form.Item name='reply' label='Nội dung' rules={[{ required: true }]}>
						<TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default AppointmentList;
