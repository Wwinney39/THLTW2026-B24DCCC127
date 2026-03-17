import React from 'react';
import { Card, Table, Descriptions } from 'antd';
import type { Appointment, Service, Staff } from '@/models/databooking';

interface Props {
	appointments: Appointment[];
	services: Service[];
	staffs: Staff[];
}

const Statistics: React.FC<Props> = ({ appointments = [], services = [], staffs = [] }) => {
	const completed = appointments.filter((a) => a.status === 'completed');

	const totalRevenue = completed.reduce((sum, a) => {
		const s = services.find((ser) => ser.id === a.serviceId);
		return sum + (s?.price || 0);
	}, 0);

	const byStaff = staffs.map((s) => {
		const appts = completed.filter((a) => a.staffId === s.id);
		const revenue = appts.reduce((sum, a) => {
			const svc = services.find((sv) => sv.id === a.serviceId);
			return sum + (svc?.price || 0);
		}, 0);
		return { name: s.name, count: appts.length, revenue };
	});

	const byService = services.map((s) => {
		const count = completed.filter((a) => a.serviceId === s.id).length;
		return { name: s.name, count, revenue: count * s.price };
	});

	return (
		<div>
			<Card title='Tổng quan' style={{ marginBottom: 24 }}>
				<Descriptions bordered column={2}>
					<Descriptions.Item label='Tổng lịch hẹn'>{appointments.length}</Descriptions.Item>
					<Descriptions.Item label='Đã hoàn thành'>{completed.length}</Descriptions.Item>
					<Descriptions.Item label='Doanh thu'>{totalRevenue.toLocaleString()} ₫</Descriptions.Item>
				</Descriptions>
			</Card>

			<Card title='Theo nhân viên' style={{ marginBottom: 24 }}>
				<Table
					dataSource={byStaff}
					columns={[
						{ title: 'Nhân viên', dataIndex: 'name' },
						{ title: 'Số lịch', dataIndex: 'count' },
						{ title: 'Doanh thu', dataIndex: 'revenue', render: (v: number) => v.toLocaleString() + ' ₫' },
					]}
					pagination={false}
				/>
			</Card>

			<Card title='Theo dịch vụ'>
				<Table
					dataSource={byService}
					columns={[
						{ title: 'Dịch vụ', dataIndex: 'name' },
						{ title: 'Số lần', dataIndex: 'count' },
						{ title: 'Doanh thu', dataIndex: 'revenue', render: (v: number) => v.toLocaleString() + ' ₫' },
					]}
					pagination={false}
				/>
			</Card>
		</div>
	);
};

export default Statistics;
