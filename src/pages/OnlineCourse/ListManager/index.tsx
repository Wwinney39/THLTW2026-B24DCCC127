import React, { useState, useMemo } from "react";
import { Table, Row, Col, Statistic, Tag, Card } from "antd";
import { UserOutlined, BookOutlined, TeamOutlined } from "@ant-design/icons";
import { courses as initialCourses } from "@/models/datacourse";

const CourseListManager: React.FC = () => {
  const [courses] = useState(initialCourses);

  const filteredCourses = useMemo(() => {
    return courses;
  }, [courses]);

  const stats = {
    total: courses.length,
    active: courses.filter(c => c.studentCount > 0).length,
    totalStudents: courses.reduce((sum, c) => sum + c.studentCount, 0),
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Tên khóa học", dataIndex: "name", key: "name" },
    { title: "Giảng viên", dataIndex: "lecturerName", key: "lecturerName", width: 150 },
    { title: "Học viên", dataIndex: "studentCount", key: "studentCount", width: 100, align: "center" as const },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        let color = "blue";
        if (status === "Đang mở") color = "green";
        else if (status === "Đã kết thúc") color = "red";
        else if (status === "Tạm dừng") color = "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Card style={{ marginBottom: "20px" }}>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Statistic
              title="Tổng khóa học"
              value={stats.total}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Khóa học đang mở"
              value={stats.active}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Tổng học viên"
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
          pagination={{ pageSize: 10, total: filteredCourses.length }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default CourseListManager;
