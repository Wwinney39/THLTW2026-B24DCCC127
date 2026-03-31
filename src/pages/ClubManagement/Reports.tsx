import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/models/store';
import { Card, Row, Col, Statistic, Table } from 'antd';

const Reports: React.FC = () => {
  const apps = useSelector((state: RootState) => state.appState.applications);
  const clubs = useSelector((state: RootState) => state.clubState.clubs);

  const totalPending = apps.filter(app => app.status === 'Pending').length;
  const totalApproved = apps.filter(app => app.status === 'Approved').length;
  const totalRejected = apps.filter(app => app.status === 'Rejected').length;
  const totalApplications = apps.length;

  const clubReport = useMemo(
    () => clubs.map(club => ({
      key: club.id,
      club: club.name,
      pending: apps.filter(app => app.clubId === club.id && app.status === 'Pending').length,
      approved: apps.filter(app => app.clubId === club.id && app.status === 'Approved').length,
      rejected: apps.filter(app => app.clubId === club.id && app.status === 'Rejected').length,
    })),
    [apps, clubs],
  );

  const columns = [
    { title: 'Câu lạc bộ', dataIndex: 'club', key: 'club' },
    { title: 'Pending', dataIndex: 'pending', key: 'pending' },
    { title: 'Approved', dataIndex: 'approved', key: 'approved' },
    { title: 'Rejected', dataIndex: 'rejected', key: 'rejected' },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title='Tổng số CLB' value={clubs.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title='Đơn Pending' value={totalPending} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title='Đơn Approved' value={totalApproved} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title='Đơn Rejected' value={totalRejected} />
          </Card>
        </Col>
      </Row>

      <Card title='Thống kê theo Câu lạc bộ' style={{ marginBottom: 24 }}>
        <Table columns={columns} dataSource={clubReport} pagination={false} rowKey='key' />
      </Card>

      <Card title='Tổng quan đơn đăng ký'>
        <Row gutter={[16, 16]}>
          <Col span={8}>Tổng đơn đăng ký: <strong>{totalApplications}</strong></Col>
          <Col span={8}>Đơn chờ duyệt: <strong>{totalPending}</strong></Col>
          <Col span={8}>Đơn đã duyệt: <strong>{totalApproved}</strong></Col>
          <Col span={8}>Đơn từ chối: <strong>{totalRejected}</strong></Col>
        </Row>
      </Card>
    </div>
  );
};

export default Reports;