import React, { useState, useMemo } from "react";
import { Card, Row, Col, Statistic, Table, Tag } from "antd";
import { COURSE_STATUS, courses as initialCourses } from "@/models/datacourse";

const CoursePlan: React.FC = () => {
  const [courses] = useState(initialCourses);

  const statusStats = useMemo(() => {
    return COURSE_STATUS.map((status: typeof COURSE_STATUS[0]) => ({
      status: status.label,
      count: courses.filter((c: typeof courses[0]) => c.status === status.value).length,
    }));
  }, [courses]);

  const lecturerStats = useMemo(() => {
    const grouped = courses.reduce((acc: Record<string, number>, course: typeof courses[0]) => {
      acc[course.lecturerName] = (acc[course.lecturerName] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([lecturerName, count]) => ({ lecturerName, count }));
  }, [courses]);

  const topCourses = useMemo(() => {
    return courses
      .sort((a: typeof courses[0], b: typeof courses[0]) => b.studentCount - a.studentCount)
      .slice(0, 5);
  }, [courses]);

  const totalStats = {
    totalCourses: courses.length,
    totalStudents: courses.reduce((sum: number, c: typeof courses[0]) => sum + c.studentCount, 0),
    activeCourses: courses.filter((c: typeof courses[0]) => c.status === "Đang mở").length,
    avgStudentsPerCourse: Math.round(courses.reduce((sum: number, c: typeof courses[0]) => sum + c.studentCount, 0) / (courses.length || 1)),
  };

  const statusColumns = [
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Số lượng", dataIndex: "count", key: "count", width: 100 },
  ];

  const lecturerColumns = [
    { title: "Giảng viên", dataIndex: "lecturerName", key: "lecturerName" },
    { title: "Số khóa học", dataIndex: "count", key: "count", width: 100 },
  ];

  const topCoursesColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Tên khóa học", dataIndex: "name", key: "name" },
    { title: "Giảng viên", dataIndex: "lecturerName", key: "lecturerName" },
    { title: "Học viên", dataIndex: "studentCount", key: "studentCount", width: 80, align: "center" as const },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
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
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Tổng khóa học" value={totalStats.totalCourses} valueStyle={{ color: "#1890ff" }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Khóa học đang mở" value={totalStats.activeCourses} valueStyle={{ color: "#52c41a" }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Tổng học viên" value={totalStats.totalStudents} valueStyle={{ color: "#faad14" }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="TB học viên/khóa" value={totalStats.avgStudentsPerCourse} valueStyle={{ color: "#ff4d4f" }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col xs={24} md={8}>
          <Card title="Khóa học theo trạng thái">
            <Table columns={statusColumns} dataSource={statusStats} rowKey="status" pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Khóa học theo giảng viên">
            <Table columns={lecturerColumns} dataSource={lecturerStats} rowKey="lecturerName" pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Thống kê">
            <div style={{ fontSize: "12px", lineHeight: "1.8" }}>
              <div>📚 Tổng: {courses.length} khóa</div>
              <div>✅ Đang mở: {courses.filter((c: typeof courses[0]) => c.status === "Đang mở").length} khóa</div>
              <div>⏸ Tạm dừng: {courses.filter((c: typeof courses[0]) => c.status === "Tạm dừng").length} khóa</div>
              <div>❌ Kết thúc: {courses.filter((c: typeof courses[0]) => c.status === "Đã kết thúc").length} khóa</div>
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #eee" }}>
                👥 Tổng: {totalStats.totalStudents} học viên
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24}>
          <Card title="Top 5 khóa học có học viên nhiều nhất">
            <Table columns={topCoursesColumns} dataSource={topCourses} rowKey="id" pagination={false} scroll={{ x: 800 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CoursePlan;
