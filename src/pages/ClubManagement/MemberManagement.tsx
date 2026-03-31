import React, { useState, useMemo, useEffect } from 'react';
import { Table, Button, Modal, Select, Input, Row, Col, message, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../models/store';
import { transferClub } from '../../models/applicationModel';

const MemberManagement: React.FC = () => {
  const dispatch = useDispatch();
  const clubs = useSelector((state: RootState) => state.clubState.clubs);
  const members = useSelector((state: RootState) => state.appState.applications.filter(a => a.status === 'Approved'));
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetClub, setTargetClub] = useState('');
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!selectedClubId && clubs.length) {
      setSelectedClubId(clubs[0].id);
    }
  }, [clubs, selectedClubId]);

  const membersInClub = useMemo(
    () => members.filter(member =>
      (!selectedClubId || member.clubId === selectedClubId) &&
      (member.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        member.email.toLowerCase().includes(searchText.toLowerCase()) ||
        member.phone.includes(searchText)),
    ),
    [members, selectedClubId, searchText],
  );

  const handleConfirmTransfer = (): void => {
    if (!targetClub) {
      message.error('Vui lòng chọn câu lạc bộ muốn chuyển đến');
      return;
    }
    dispatch(transferClub({ ids: selectedKeys as string[], newClubId: targetClub }));
    message.success(`Chuyển ${selectedKeys.length} thành viên sang CLB mới thành công`);
    setSelectedKeys([]);
    setIsModalOpen(false);
    setTargetClub('');
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Sở trường', dataIndex: 'expertise', key: 'expertise' },
    {
      title: 'Câu lạc bộ hiện tại',
      dataIndex: 'clubId',
      key: 'clubId',
      render: (id: string) => clubs.find(c => c.id === id)?.name || 'N/A',
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (text: string) => text || 'N/A',
    },
  ];

  const availableClubs = clubs.filter(club => club.id !== selectedClubId);

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col>
          <Select value={selectedClubId} onChange={setSelectedClubId} style={{ width: 240 }} placeholder='Chọn CLB để xem thành viên'>
            {clubs.map(club => (
              <Select.Option key={club.id} value={club.id}>{club.name}</Select.Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Input.Search
            placeholder='Tìm kiếm theo tên, email, SĐT...'
            allowClear
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 320 }}
          />
        </Col>
        <Col>
          <Button type='primary' disabled={!selectedKeys.length} onClick={() => setIsModalOpen(true)}>
            Đổi CLB cho {selectedKeys.length} thành viên
          </Button>
        </Col>
      </Row>

      <Table
        rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
        dataSource={membersInClub}
        columns={columns}
        rowKey='id'
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={`Chuyển ${selectedKeys.length} thành viên sang CLB khác`}
        visible={isModalOpen}
        onOk={handleConfirmTransfer}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          <div>Số thành viên được chọn: <strong>{selectedKeys.length}</strong></div>
          <Select
            value={targetClub}
            onChange={setTargetClub}
            style={{ width: '100%' }}
            placeholder='Chọn CLB đích'
          >
            {availableClubs.map(club => (
              <Select.Option key={club.id} value={club.id}>{club.name}</Select.Option>
            ))}
          </Select>
        </Space>
      </Modal>
    </div>
  );
};

export default MemberManagement;