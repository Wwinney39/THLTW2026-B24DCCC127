import React, { useState, useMemo } from 'react';
import { 
  Table, Button, Space, Modal, Form, Input, Switch, 
  message, DatePicker, Row, Col, Popconfirm, Tag, Avatar 
} from 'antd';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../models/store';
import { saveClub, deleteClub, Club } from '../../models/clubModel';
import RichTextEditor from './RichTextEditor';

const ClubList: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const clubs = useSelector((state: RootState) => state.clubState.clubs);
  const applications = useSelector((state: RootState) => state.appState.applications);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  // Filter tìm kiếm
  const filteredClubs = useMemo(() => 
    clubs.filter(club =>
      club.name.toLowerCase().includes(searchText.toLowerCase()) ||
      club.leader.toLowerCase().includes(searchText.toLowerCase())
    ), [clubs, searchText]
  );

  const handleSave = (values: any) => {
    const clubData: Club = {
      id: editingId || `club_${Date.now()}`,
      ...values,
      foundingDate: values.foundingDate.format('YYYY-MM-DD'),
      avatar: values.avatar || 'https://via.placeholder.com/60',
    };
    
    dispatch(saveClub(clubData));
    message.success(editingId ? 'Cập nhật thành công' : 'Thêm mới thành công');
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleEdit = (club: Club) => {
    setEditingId(club.id);
    form.setFieldsValue({
      ...club,
      foundingDate: moment(club.foundingDate, 'YYYY-MM-DD'),
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Thông tin CLB',
      key: 'info',
      render: (_: any, record: Club) => (
        <Space>
          <Avatar shape="square" size={50} src={record.avatar} />
          <div style={{ fontWeight: 'bold' }}>{record.name}</div>
        </Space>
      ),
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'leader',
      key: 'leader',
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundingDate',
      key: 'foundingDate',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>{active ? 'Hoạt động' : 'Tạm dừng'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: Club) => (
        <Space>
          <Button size="small" onClick={() => { setSelectedClub(record); setMemberModalOpen(true); }}>
            Thành viên
          </Button>
          <Button size="small" type="primary" ghost onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa CLB này?"
            onConfirm={() => dispatch(deleteClub(record.id))}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger ghost>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const membersForClub = selectedClub
    ? applications.filter(app => app.clubId === selectedClub.id && app.status === 'Approved')
    : [];

  return (
    <div style={{ padding: '20px' }}>
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <Col>
          <Input.Search
            placeholder="Tìm theo tên hoặc chủ nhiệm..."
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </Col>
        <Col>
          <Button type="primary" onClick={() => { setEditingId(null); form.resetFields(); setIsModalOpen(true); }}>
            + Thêm CLB mới
          </Button>
        </Col>
      </Row>

      <Table 
        dataSource={filteredClubs} 
        columns={columns} 
        rowKey="id" 
        bordered 
        pagination={{ pageSize: 6 }} 
      />

      {/* MODAL THÊM / SỬA */}
      <Modal
        title={editingId ? 'Cập nhật thông tin CLB' : 'Thêm mới Câu lạc bộ'}
        visible={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu thành viên"
        cancelText="Bỏ qua"
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="avatar" label="URL Ảnh đại diện">
                <Input placeholder="Dán link ảnh vào đây" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="Tên Câu lạc bộ" rules={[{ required: true, message: 'Thiếu tên CLB' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="leader" label="Chủ nhiệm" rules={[{ required: true, message: 'Thiếu chủ nhiệm' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="foundingDate" label="Ngày thành lập" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isActive" label="Trạng thái hoạt động" valuePropName="checked">
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả chi tiết">
                <RichTextEditor />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* MODAL THÀNH VIÊN */}
      <Modal
        title={`Danh sách thành viên: ${selectedClub?.name}`}
        visible={memberModalOpen}
        onCancel={() => setMemberModalOpen(false)}
        okText="Xác nhận thêm"
        cancelText="Bỏ qua"
        footer={null}
        width={850}
      >
        <Table
          dataSource={membersForClub}
          rowKey="id"
          columns={[
            { title: 'Họ tên', dataIndex: 'fullName' },
            { title: 'Email', dataIndex: 'email' },
            { title: 'SĐT', dataIndex: 'phone' },
            { title: 'Gia nhập', dataIndex: 'joinedAt' },
          ]}
        />
      </Modal>
    </div>
  );
};

export default ClubList;