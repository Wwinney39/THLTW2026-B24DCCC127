import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Popconfirm,
  Tag,
  InputNumber,
} from "antd";
import { COURSE_STATUS, lecturers, courses as initialCourses, Course, isCourseNameExists, generateNewCourseId, getLecturerNameById } from "@/models/datacourse";
import RichTextEditor from "../../ClubManagement/RichTextEditor";

const CourseAdmin: React.FC = () => {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterLecturer, setFilterLecturer] = useState<number | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [sortByStudent, setSortByStudent] = useState(false);

  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses];
    if (searchText) {
      result = result.filter(course =>
        course.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterLecturer) {
      result = result.filter(course => course.lecturerId === filterLecturer);
    }
    if (filterStatus) {
      result = result.filter(course => course.status === filterStatus);
    }
    if (sortByStudent) {
      result = result.sort((a, b) => b.studentCount - a.studentCount);
    }
    return result;
  }, [courses, searchText, filterLecturer, filterStatus, sortByStudent]);

  const handleSave = (values: any) => {
    if (!values.name || values.name.trim() === "") {
      message.error("Tên khóa học không được để trống");
      return;
    }
    if (values.name.length > 100) {
      message.error("Tên khóa học không được vượt quá 100 ký tự");
      return;
    }
    if (isCourseNameExists(values.name, editingId)) {
      message.error("Tên khóa học này đã tồn tại");
      return;
    }
    if (!values.lecturerId) {
      message.error("Giảng viên không được để trống");
      return;
    }
    if (values.studentCount === undefined || values.studentCount === null || values.studentCount < 0) {
      message.error("Số lượng học viên phải lớn hơn hoặc bằng 0");
      return;
    }
    if (!values.description || values.description.trim() === "") {
      message.error("Mô tả khóa học không được để trống");
      return;
    }
    if (!values.status) {
      message.error("Trạng thái khóa học không được để trống");
      return;
    }

    const lecturerName = getLecturerNameById(values.lecturerId);

    if (editingId) {
      setCourses(
        courses.map(c =>
          c.id === editingId
            ? {
              ...c,
              name: values.name.trim(),
              lecturerId: values.lecturerId,
              lecturerName: lecturerName,
              studentCount: values.studentCount,
              description: values.description,
              status: values.status,
              canDelete: values.studentCount === 0,
            }
            : c
        )
      );
      message.success("Cập nhật khóa học thành công");
    } else {
      const newCourse: Course = {
        id: generateNewCourseId(),
        name: values.name.trim(),
        lecturerId: values.lecturerId,
        lecturerName: lecturerName,
        studentCount: values.studentCount,
        description: values.description,
        status: values.status,
        createdAt: new Date().toISOString().split("T")[0],
        canDelete: values.studentCount === 0,
      };
      setCourses([...courses, newCourse]);
      message.success("Thêm khóa học thành công");
    }

    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    form.setFieldsValue(course);
    setIsModalOpen(true);
  };

  const handleDelete = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (course && course.studentCount > 0) {
      message.error("Không thể xóa khóa học vì đã có học viên");
      return;
    }
    setCourses(courses.filter(c => c.id !== courseId));
    message.success("Xóa khóa học thành công");
  };

  const columns = [
    { title: "ID khóa học", dataIndex: "id", key: "id", width: 100 },
    { title: "Tên khóa học", dataIndex: "name", key: "name", width: 250 },
    { title: "Giảng viên", dataIndex: "lecturerName", key: "lecturerName", width: 150 },
    { title: "Số học viên", dataIndex: "studentCount", key: "studentCount", width: 120, align: "center" as const },
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
    {
      title: "Thao tác",
      key: "actions",
      width: 180,
      render: (_: any, record: Course) => (
        <Space>
          <Button size="small" type="primary" ghost onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khóa học này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
            disabled={record.studentCount > 0}
          >
            <Button size="small" danger disabled={record.studentCount > 0}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ background: "white", padding: "20px", borderRadius: "4px" }}>
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col span={24}>
            <h2>Quản lý khóa học online</h2>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm theo tên khóa học"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo giảng viên"
              value={filterLecturer}
              onChange={setFilterLecturer}
              allowClear
              style={{ width: "100%" }}
              options={lecturers.map((lecturer: typeof lecturers[0]) => ({
                label: lecturer.name,
                value: lecturer.id,
              }))}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={filterStatus}
              onChange={setFilterStatus}
              allowClear
              style={{ width: "100%" }}
              options={COURSE_STATUS}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              type={sortByStudent ? "primary" : "default"}
              onClick={() => setSortByStudent(!sortByStudent)}
              style={{ width: "100%" }}
            >
              {sortByStudent ? "Sắp xếp theo học viên ✓" : "Sắp xếp theo học viên"}
            </Button>
          </Col>
        </Row>

        <Row style={{ marginBottom: "20px" }}>
          <Col>
            <Button
              type="primary"
              onClick={() => {
                setEditingId(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              + Thêm khóa học mới
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredAndSortedCourses}
          rowKey="id"
          pagination={{ pageSize: 10, total: filteredAndSortedCourses.length }}
          scroll={{ x: 1000 }}
        />

        <Modal
          title={editingId ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
          open={isModalOpen}
          onOk={() => form.submit()}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingId(null);
            form.resetFields();
          }}
          width={700}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item
              label="Tên khóa học"
              name="name"
              rules={[
                { required: true, message: "Tên khóa học không được để trống" },
                { max: 100, message: "Tên khóa học không được vượt quá 100 ký tự" },
              ]}
            >
              <Input placeholder="Nhập tên khóa học (Tối đa 100 ký tự)" maxLength={100} />
            </Form.Item>

            <Form.Item
              label="Giảng viên"
              name="lecturerId"
              rules={[{ required: true, message: "Giảng viên không được để trống" }]}
            >
              <Select
                placeholder="Chọn giảng viên"
                options={lecturers.map((lecturer: typeof lecturers[0]) => ({
                  label: lecturer.name,
                  value: lecturer.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Số lượng học viên"
              name="studentCount"
              rules={[
                { required: true, message: "Số lượng học viên không được để trống" },
              ]}
            >
              <InputNumber
                min={0}
                step={1}
                placeholder="Nhập số lượng học viên"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Trạng thái khóa học không được để trống" }]}
            >
              <Select placeholder="Chọn trạng thái" options={COURSE_STATUS} />
            </Form.Item>

            <Form.Item
              label="Mô tả khóa học"
              name="description"
              rules={[{ required: true, message: "Mô tả khóa học không được để trống" }]}
            >
              <RichTextEditor />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default CourseAdmin;
