import React, { useState, useEffect, useMemo } from 'react';
import {
	Layout,
	Tabs,
	Card,
	Table,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	Select,
	DatePicker,
	Progress,
	Space,
	Popconfirm,
	message,
	Typography,
	Tag,
} from 'antd';
import { PlusOutlined, BookOutlined, HistoryOutlined, BarChartOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { studyService, Subject, StudyLog, MonthlyGoal } from '@/models/studymanager';

import localeVN from 'antd/es/date-picker/locale/vi_VN';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const QuanLyTienDo = () => {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [logs, setLogs] = useState<StudyLog[]>([]);
	const [goals, setGoals] = useState<MonthlyGoal[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingLog, setEditingLog] = useState<StudyLog | null>(null);
	const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		dayjs.locale('vi');
	}, []);

	useEffect(() => {
		setSubjects(studyService.getSubjects() || []);
		setLogs(studyService.getLogs() || []);
		setGoals(studyService.getGoals() || []);
	}, []);

	useEffect(() => {
		studyService.saveSubjects(subjects);
	}, [subjects]);
	useEffect(() => {
		studyService.saveLogs(logs);
	}, [logs]);
	useEffect(() => {
		studyService.saveGoals(goals);
	}, [goals]);

	const onFinishLog = (values: any) => {
		const newLog: StudyLog = {
			...values,
			id: Date.now().toString(),

			date: values.date ? values.date.format('YYYY-MM-DD HH:mm') : dayjs().format('YYYY-MM-DD HH:mm'),
		};
		setLogs([newLog, ...logs]);
		setIsModalOpen(false);
		form.resetFields();
		message.success('Đã lưu tiến độ học tập thành công!');
	};

	const stats = useMemo(() => {
		const currentMonth = dayjs().format('YYYY-MM');
		return subjects.map((sub) => {
			const total = logs
				.filter((l) => l.subjectId === sub.id && l.date.startsWith(currentMonth))
				.reduce((sum, l) => sum + (Number(l.duration) || 0), 0);
			const goal = goals.find((g) => g.subjectId === sub.id)?.targetMinutes || 0;
			return { ...sub, total, goal, percent: goal > 0 ? Math.min((total / goal) * 100, 100) : 0 };
		});
	}, [subjects, logs, goals]);

	return (
		<Layout style={{ background: '#f0f2f5', minHeight: '100vh', padding: '24px 0' }}>
			<Content style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
				<Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
					<Title level={3} style={{ marginBottom: 24 }}>
						<BookOutlined /> Quản Lý Tiến Độ Học Tập
					</Title>

					<Tabs defaultActiveKey='1' type='card'>
						<TabPane
							tab={
								<span>
									<HistoryOutlined /> Tiến độ
								</span>
							}
							key='1'
						>
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={() => setIsModalOpen(true)}
								block
								size='large'
								style={{ marginBottom: 20, height: '45px', borderRadius: '6px' }}
							>
								Thêm buổi học mới
							</Button>

							<Table
								dataSource={logs}
								rowKey='id'
								pagination={{ pageSize: 5 }}
								locale={{ emptyText: 'Bạn chưa có nhật ký học tập nào' }}
								columns={[
									{
										title: 'Môn học',
										dataIndex: 'subjectId',
										render: (id: string) => {
											const sub = subjects.find((s) => s.id === id);
											return sub ? <Text>{sub.name}</Text> : <Text type='secondary'>N/A</Text>;
										},
									},
									{ title: 'Thời gian', dataIndex: 'date' },
									{
										title: 'Thời lượng',
										dataIndex: 'duration',
										render: (d: number) => <Tag color='blue'>{d} phút</Tag>,
									},
									{ title: 'Nội dung', dataIndex: 'content', ellipsis: true },
									{
										title: 'Tác vụ',
										align: 'center',
										render: (_, record) => (
											<Space>
												<Button
													type='link'
													onClick={() => {
														setEditingLog(record);
														form.setFieldsValue({
															...record,
															date: dayjs(record.date),
														});
														setIsModalOpen(true);
													}}
												>
													Sửa
												</Button>

												<Popconfirm title='Xóa?' onConfirm={() => setLogs(logs.filter((l) => l.id !== record.id))}>
													<Button type='text' danger icon={<DeleteOutlined />} />
												</Popconfirm>
											</Space>
										),
									},
								]}
							/>
						</TabPane>

						<TabPane
							tab={
								<span>
									<BarChartOutlined /> Mục tiêu tháng
								</span>
							}
							key='2'
						>
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
								{stats.length > 0 ? (
									stats.map((s) => (
										<Card key={s.id} size='small' title={s.name} hoverable>
											<Text type='secondary'>Tiến độ: </Text>
											<Text strong>
												{s.total} / {s.goal}
											</Text>{' '}
											<Text type='secondary'>phút</Text>
											<Progress percent={Math.round(s.percent)} status={s.percent >= 100 ? 'success' : 'active'} />
										</Card>
									))
								) : (
									<Text type='secondary'>Vui lòng thêm môn học ở tab Cấu hình.</Text>
								)}
							</div>
						</TabPane>

						<TabPane tab='Cấu hình môn' key='3'>
							<Input.Search
								placeholder='Nhập tên môn học mới (VD: ReactJS, TOEIC...)'
								enterButton='Thêm môn'
								size='large'
								onSearch={(val) => {
									if (val.trim()) {
										const newId = Date.now().toString();
										setSubjects([...subjects, { id: newId, name: val.trim() }]);
										setGoals([...goals, { subjectId: newId, targetMinutes: 60 }]);
										message.success(`Đã thêm môn: ${val}`);
									}
								}}
							/>
							<Table
								dataSource={subjects}
								rowKey='id'
								size='small'
								locale={{ emptyText: 'Chưa có dữ liệu học tập' }}
								style={{ marginTop: 20 }}
								columns={[
									{ title: 'Tên môn học', dataIndex: 'name', render: (text) => <Text strong>{text}</Text> },
									{
										title: 'Quản lý',
										align: 'right',
										render: (_, rec) => (
											<Space>
												<Button
													type='link'
													onClick={() => {
														setEditingSubject(rec);
														form.setFieldsValue({ editSubjectName: rec.name });
													}}
												>
													Sửa
												</Button>

												<Popconfirm
													title='Xóa môn này sẽ mất dữ liệu liên quan, bạn chắc chứ?'
													onConfirm={() => {
														setSubjects(subjects.filter((s) => s.id !== rec.id));
														message.warning('Đã xóa môn học');
													}}
													okText='Xóa luôn'
													cancelText='Hủy'
												>
													<Button type='link' danger>
														Xóa
													</Button>
												</Popconfirm>
											</Space>
										),
									},
								]}
							/>
						</TabPane>
					</Tabs>
				</Card>

				<Modal
					title='Ghi chú buổi học mới'
					visible={isModalOpen}
					onCancel={() => setIsModalOpen(false)}
					onOk={() => form.submit()}
					destroyOnClose
					okText='Lưu lại'
					cancelText='Đóng'
					width={500}
				>
					<Form form={form} layout='vertical' onFinish={onFinishLog} initialValues={{ date: dayjs(), duration: 60 }}>
						<Form.Item name='subjectId' label='Môn học' rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
							<Select
								placeholder='-- Chọn môn học từ danh sách --'
								options={subjects.map((s) => ({ label: s.name, value: s.id }))}
							/>
						</Form.Item>

						<Space style={{ display: 'flex', width: '100%' }} size='large'>
							<Form.Item name='date' label='Ngày & Giờ học' rules={[{ required: true, message: 'Chọn thời gian' }]}>
								<DatePicker locale={localeVN} format='DD/MM/YYYY' placeholder='Chọn ngày' style={{ width: '220px' }} />
							</Form.Item>

							<Form.Item
								name='duration'
								label='Thời lượng (phút)'
								rules={[{ required: true, message: 'Nhập số phút' }]}
							>
								<InputNumber min={1} style={{ width: '150px' }} placeholder='60' />
							</Form.Item>
						</Space>

						<Form.Item
							name='content'
							label='Nội dung bài học'
							rules={[{ required: true, message: 'Bạn đã học những gì?' }]}
						>
							<Input.TextArea rows={4} placeholder='Ví dụ: Học về React Hooks, làm bài tập Nmap...' />
						</Form.Item>
					</Form>
				</Modal>

				<Modal
					title='Chỉnh sửa tên môn học'
					visible={!!editingSubject}
					onCancel={() => setEditingSubject(null)}
					onOk={() => {
						const newName = form.getFieldValue('editSubjectName');
						if (newName) {
							setSubjects(subjects.map((s) => (s.id === editingSubject?.id ? { ...s, name: newName } : s)));
							setEditingSubject(null);
							message.success('Đã cập nhật tên môn học');
						}
					}}
					okText='Cập nhật'
					cancelText='Hủy'
				>
					<Form form={form} layout='vertical'>
						<Form.Item name='editSubjectName' label='Tên môn học mới'>
							<Input />
						</Form.Item>
					</Form>
				</Modal>
			</Content>
		</Layout>
	);
};

export default QuanLyTienDo;
