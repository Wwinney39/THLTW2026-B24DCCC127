import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Tag, Modal, Input, message, Form, Select, Descriptions, Row, Col, Popconfirm } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../models/store';
import { Application, updateStatus, saveApplication, deleteApplication } from '../../models/applicationModel';

const MemberApplications: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const apps = useSelector((state: RootState) => state.appState.applications);
  const clubs = useSelector((state: RootState) => state.clubState.clubs);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [rejectModal, setRejectModal] = useState({ open: false, reason: '', ids: [] as string[] });
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentApp, setCurrentApp] = useState<Application | null>(null);
  const [detailApp, setDetailApp] = useState<Application | null>(null);
  const [historyApp, setHistoryApp] = useState<Application | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const clubsById = useMemo(() => Object.fromEntries(clubs.map(club => [club.id, club.name])), [clubs]);

  const applicationsWithClub = useMemo(
    () => apps.map(app => ({ ...app, clubName: clubsById[app.clubId] || 'Chưa chọn' })),
    [apps, clubsById],
  );

  const filteredApps = useMemo(
    () => applicationsWithClub.filter(app => {
      const matchesSearch =
        app.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        app.email.toLowerCase().includes(searchText.toLowerCase()) ||
        app.phone.includes(searchText) ||
        app.expertise.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    }),
    [applicationsWithClub, searchText, statusFilter],
  );

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentApp(null);
    form.resetFields();
    setAppModalOpen(true);
  };

  const openEditModal = (app: Application) => {
    setIsEditMode(true);
    setCurrentApp(app);
    form.setFieldsValue({
      ...app,
      clubId: app.clubId,
    });
    setAppModalOpen(true);
  };

  const handleSaveApplication = (values: any) => {
    const payload: Application = {
      id: currentApp?.id || Date.now().toString(),
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      gender: values.gender,
      address: values.address,
      expertise: values.expertise,
      clubId: values.clubId,
      reason: values.reason,
      status: currentApp?.status || 'Pending',
      history: currentApp?.history || [`Người dùng đã gửi đơn vào ${new Date().toLocaleString('vi-VN')}`],
      note: currentApp?.note,
      joinedAt: currentApp?.joinedAt,
    };
    dispatch(saveApplication(payload));
    message.success(isEditMode ? 'Cập nhật đơn đăng ký thành công' : 'Tạo đơn đăng ký thành công');
    setAppModalOpen(false);
    setCurrentApp(null);
    setIsEditMode(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteApplication(id));
    message.success('Xóa đơn đăng ký thành công');
  };

  const handleApprove = (ids: string[]) => {
    if (!ids.length) return;
    dispatch(updateStatus({ ids, status: 'Approved' }));
    message.success(`Đã duyệt ${ids.length} đơn`);
    setSelectedKeys([]);
  };

  const openRejectModal = (ids: string[]) => {
    setRejectModal({ open: true, reason: '', ids });
  };

  const handleConfirmReject = (): void => {
    if (!rejectModal.reason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    dispatch(updateStatus({ ids: rejectModal.ids, status: 'Rejected', note: rejectModal.reason.trim() }));
    message.success(`Đã từ chối ${rejectModal.ids.length} đơn`);
    setRejectModal({ open: false, reason: '', ids: [] });
    setSelectedKeys([]);
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName', sorter: (a: Application, b: Application) => a.fullName.localeCompare(b.fullName) },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Sở trường', dataIndex: 'expertise', key: 'expertise' },
    { title: 'Câu lạc bộ', dataIndex: 'clubName', key: 'clubName' },
    {
      title: 'Lý do đăng ký',
      dataIndex: 'reason',
      key: 'reason',
      render: (text: string) => text.length > 40 ? `${text.slice(0, 40)}...` : text,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'orange';
        if (status === 'Approved') color = 'green';
        if (status === 'Rejected') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value: any, record: Application) => record.status === value,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Application) => (
        <Space size='small'>
          <Button type='link' onClick={() => { setDetailApp(record); }}>
            Chi tiết
          </Button>
          <Button type='link' onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm title='Bạn có muốn xóa đơn này?' onConfirm={() => handleDelete(record.id)} okText='Có' cancelText='Không'>
            <Button type='link' danger>Xóa</Button>
          </Popconfirm>
          {record.status === 'Pending' && (
            <>
              <Button type='link' onClick={() => handleApprove([record.id])}>Duyệt</Button>
              <Button type='link' danger onClick={() => openRejectModal([record.id])}>Từ chối</Button>
            </>
          )}
          <Button type='link' onClick={() => setHistoryApp(record)}>
            Lịch sử
          </Button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (keys: React.Key[]) => setSelectedKeys(keys),
    getCheckboxProps: (record: Application) => ({
      disabled: record.status !== 'Pending',
    }),
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col>
          <Input.Search
            placeholder='Tìm kiếm theo tên, email, SĐT, sở trường...'
            allowClear
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </Col>
        <Col>
          <Select value={statusFilter} onChange={value => setStatusFilter(value)} style={{ width: 180 }}>
            <Select.Option value='All'>Tất cả trạng thái</Select.Option>
            <Select.Option value='Pending'>Pending</Select.Option>
            <Select.Option value='Approved'>Approved</Select.Option>
            <Select.Option value='Rejected'>Rejected</Select.Option>
          </Select>
        </Col>
        <Col>
          <Button type='primary' onClick={openCreateModal}>Thêm đơn đăng ký</Button>
        </Col>
        <Col>
          <Button type='primary' disabled={!selectedKeys.length} onClick={() => handleApprove(selectedKeys as string[])}>
            Duyệt {selectedKeys.length} đơn
          </Button>
        </Col>
        <Col>
          <Button danger disabled={!selectedKeys.length} onClick={() => openRejectModal(selectedKeys as string[])}>
            Từ chối {selectedKeys.length} đơn
          </Button>
        </Col>
      </Row>

      <Table
        rowSelection={rowSelection}
        dataSource={filteredApps}
        columns={columns}
        rowKey='id'
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      <Modal
        title={isEditMode ? 'Chỉnh sửa đơn đăng ký' : 'Thêm mới đơn đăng ký'}
        visible={appModalOpen}
        onOk={() => form.submit()}
        onCancel={() => { setAppModalOpen(false); setCurrentApp(null); setIsEditMode(false); form.resetFields(); }}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout='vertical' onFinish={handleSaveApplication}>
          <Form.Item name='fullName' label='Họ tên' rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='email' label='Email' rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='phone' label='Số điện thoại' rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='gender' label='Giới tính' rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
            <Select>
              <Select.Option value='Nam'>Nam</Select.Option>
              <Select.Option value='Nữ'>Nữ</Select.Option>
              <Select.Option value='Khác'>Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name='address' label='Địa chỉ' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='expertise' label='Sở trường' rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='clubId' label='Câu lạc bộ' rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}>
            <Select>
              {clubs.map(club => (
                <Select.Option key={club.id} value={club.id}>{club.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='reason' label='Lý do đăng ký' rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title='Chi tiết đơn đăng ký'
        visible={!!detailApp}
        onOk={() => setDetailApp(null)}
        onCancel={() => setDetailApp(null)}
        okText="ok"
        cancelText="Bỏ qua"
        width={700}
      >
        {detailApp && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label='Họ tên'>{detailApp.fullName}</Descriptions.Item>
            <Descriptions.Item label='Email'>{detailApp.email}</Descriptions.Item>
            <Descriptions.Item label='Số điện thoại'>{detailApp.phone}</Descriptions.Item>
            <Descriptions.Item label='Giới tính'>{detailApp.gender}</Descriptions.Item>
            <Descriptions.Item label='Địa chỉ'>{detailApp.address}</Descriptions.Item>
            <Descriptions.Item label='Sở trường'>{detailApp.expertise}</Descriptions.Item>
            <Descriptions.Item label='Câu lạc bộ'>{clubsById[detailApp.clubId] || 'Chưa chọn'}</Descriptions.Item>
            <Descriptions.Item label='Lý do đăng ký'>{detailApp.reason}</Descriptions.Item>
            <Descriptions.Item label='Trạng thái'>{detailApp.status}</Descriptions.Item>
            <Descriptions.Item label='Ghi chú'>{detailApp.note || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label='Thời gian tham gia'>{detailApp.joinedAt || 'N/A'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title='Lịch sử thao tác'
        visible={!!historyApp}
        onOk={() => setHistoryApp(null)}
        onCancel={() => setHistoryApp(null)}
        width={700}
      >
        {historyApp?.history.map((log, index) => (
          <p key={index} style={{ marginBottom: 8 }}>{log}</p>
        ))}
      </Modal>

      <Modal
        title='Từ chối đơn đăng ký'
        visible={rejectModal.open}
        onOk={handleConfirmReject}
        onCancel={() => setRejectModal({ open: false, reason: '', ids: [] })}
        width={600}
      >
        <Input.TextArea
          placeholder='Nhập lý do từ chối...'
          rows={4}
          value={rejectModal.reason}
          onChange={e => setRejectModal({ ...rejectModal, reason: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default MemberApplications;