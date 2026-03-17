import { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import type { Appointment, Staff, Service } from '@/models/databooking';
import { STAFFS, SERVICES } from '@/models/databooking';
import StaffManagement from './StaffManagement';
import ServiceManagement from './ServiceManagement';
import BookingManagement from './BookingManagement';
import AppointmentList from './AppointmentList';
import Statistics from './Statistics';

const Booking = () => {
	const [staffs, setStaffs] = useState<Staff[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [appointments, setAppointments] = useState<Appointment[]>([]);

	// Load data from localStorage on mount, with sample data as default
	useEffect(() => {
		const savedStaffs = localStorage.getItem('data_staffs');
		const savedServices = localStorage.getItem('data_services');
		const savedApps = localStorage.getItem('data_appointments');

		setStaffs(savedStaffs ? JSON.parse(savedStaffs) : STAFFS);
		setServices(savedServices ? JSON.parse(savedServices) : SERVICES);
		setAppointments(savedApps ? JSON.parse(savedApps) : []);
	}, []);

	// Save to localStorage whenever data changes
	useEffect(() => {
		localStorage.setItem('data_staffs', JSON.stringify(staffs));
	}, [staffs]);

	useEffect(() => {
		localStorage.setItem('data_services', JSON.stringify(services));
	}, [services]);

	useEffect(() => {
		localStorage.setItem('data_appointments', JSON.stringify(appointments));
	}, [appointments]);

	const items = [
		{
			key: 'staff',
			label: 'Nhân viên',
			children: <StaffManagement staffs={staffs} setStaffs={setStaffs} appointments={appointments} />,
		},
		{
			key: 'service',
			label: 'Dịch vụ',
			children: <ServiceManagement services={services} setServices={setServices} />,
		},
		{
			key: 'booking',
			label: 'Đặt lịch',  
			children: <BookingManagement staffs={STAFFS} services={SERVICES} appointments={appointments} setAppointments={setAppointments} />,
		},
		{
			key: 'appointments',
			label: 'Lịch hẹn',
			children: <AppointmentList appointments={appointments} setAppointments={setAppointments} services={services} staffs={staffs} />,
		},
		{
			key: 'stats',
			label: 'Thống kê',
			children: <Statistics appointments={appointments} services={SERVICES} staffs={staffs} />,
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<h1>Quản lý Đặt Lịch Dịch Vụ</h1>
			<Tabs items={items} />
		</div>
	);
};

export default Booking;