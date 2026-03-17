import { Form, Button, Select, DatePicker, TimePicker, Card, message } from 'antd';
import type { Appointment, Staff, Service } from '@/models/databooking';

interface Props {
	staffs: Staff[];
	services: Service[];
	appointments: Appointment[];
	setAppointments: (value: Appointment[] | ((prev: Appointment[]) => Appointment[])) => void;
}

const BookingManagement: React.FC<Props> = ({ staffs, services, appointments, setAppointments }) => {
	const [form] = Form.useForm();

	const timeToMinutes = (timeStr: string | null | undefined): number => {
		if (!timeStr) return 0;
		const [h, m] = timeStr.split(':').map(Number);
		return (h || 0) * 60 + (m || 0);
	};

	const hasOverlap = (
		staffId: number,
		date: string,
		startTime: string,
		endTime: string,
		excludeId?: number,
	): boolean => {
		const newStart = timeToMinutes(startTime);
		const newEnd = timeToMinutes(endTime);

		return appointments.some((a) => {
			if (a.staffId !== staffId || a.date !== date) return false;
			if (excludeId && a.id === excludeId) return false;

			const existingStart = timeToMinutes(a.startTime);
			const existingEnd = timeToMinutes(a.endTime);

			return newStart < existingEnd && newEnd > existingStart;
		});
	};

	const countAppointmentsOnDay = (staffId: number, date: string, excludeId?: number): number => {
		return appointments.filter(
			(a) => a.staffId === staffId && a.date === date && (!excludeId || a.id !== excludeId),
		).length;
	};

	const handleBook = async () => {
		try {
			const values = await form.validateFields();
			const { staffId, serviceId, date, startTime, endTime, customerName } = values;

			const staff = staffs?.find((s) => s.id === staffId);
			const service = services.find((s) => s.id === serviceId);

			if (!staff || !service) {
				message.error('Invalid staff or service');
				return;
			}

			const dateStr = date.format('YYYY-MM-DD');
			const startStr = startTime.format('HH:mm');
			const endStr = endTime.format('HH:mm');

			// Check work hours
			if (startStr < staff.workStart || endStr > staff.workEnd) {
				message.error('Outside work hours');
				return;
			}

			// Check for conflicts
			if (hasOverlap(staffId, dateStr, startStr, endStr)) {
				message.error('Time slot already booked');
				return;
			}

			// Check daily limit
			if (countAppointmentsOnDay(staffId, dateStr) >= staff.maxCustomersPerDay) {
				message.error('Daily limit reached');
				return;
			}

			const newAppointment: Appointment = {
				id: Date.now() + Math.floor(Math.random() * 1000),
				customerName: customerName || 'Guest',
				serviceId,
				staffId,
				date: dateStr,
				startTime: startStr,
				endTime: endStr,
				status: 'pending',
			};

			setAppointments((prev) => [...prev, newAppointment]);
			form.resetFields();
			message.success('Appointment booked successfully');
		} catch (error) {
			console.error('Validation error:', error);
		}
	};

	return (
		<Card title='Đặt Lịch Hẹn'>
			<Form form={form} layout='vertical' onFinish={handleBook}>
				<Form.Item name='customerName' label='Tên khách hàng' rules={[{ required: false }]}>
					<input placeholder='Leave blank for Guest' />
				</Form.Item>

				<Form.Item name='staffId' label='Nhân viên' rules={[{ required: true, message: 'Please select staff' }]}>
					<Select placeholder='Select staff'>
						{staffs?.map((s) => (
							<Select.Option key={s.id} value={s.id}>
								{s.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name='serviceId' label='Dịch vụ' rules={[{ required: true, message: 'Please select service' }]}>
					<Select placeholder='Select service'>
						{services?.map((s) => (
							<Select.Option key={s.id} value={s.id}>
								{s.name} - {s.price.toLocaleString()} ₫ ({s.duration} phút)
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name='date' label='Ngày' rules={[{ required: true, message: 'Please select date' }]}>
					<DatePicker />
				</Form.Item>

				<Form.Item name='startTime' label='Giờ bắt đầu' rules={[{ required: true, message: 'Please select start time' }]}>
					<TimePicker format='HH:mm' />
				</Form.Item>

				<Form.Item name='endTime' label='Giờ kết thúc' rules={[{ required: true, message: 'Please select end time' }]}>
					<TimePicker format='HH:mm' />
				</Form.Item>

				<Form.Item>
					<Button type='primary' htmlType='submit' block>
						Đặt Lịch
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default BookingManagement;
