export const COURSE_STATUS = [
  { value: "Đang mở", label: "Đang mở" },
  { value: "Tạm dừng", label: "Tạm dừng" },
  { value: "Đã kết thúc", label: "Đã kết thúc" }
];

export interface Lecturer {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface Course {
  id: number;
  name: string;
  lecturerId: number;
  lecturerName: string;
  studentCount: number;
  status: string;
  description: string;
  createdAt: string;
  canDelete: boolean;
}



export const lecturers = [
  {
    id: 1,
    name: "Rensuke Kunigami",
    email: "rensukekunigami@edu.vn",
  },
  {
    id: 2,
    name: "Saitama",
    email: "saitama@edu.vn",
  },
  {
    id: 3,
    name: "Satoju Gojo",
    email: "satojugojo@edu.vn",
  },
  {
    id: 4,
    name: "Noel Noa",
    email: "noelnoa@edu.vn",
  },
  {
    id: 5,
    name: "Yoichi Isagi",
    email: "yoichiisagi@edu.vn",
  },
  {
    id: 6,
    name: "Seishiro Nagi",
    email: "seishironagi@edu.vn",
  }
];


export let courses = [
  {
    id: 1,
    name: "Lập trình JavaScript Cơ bản",
    lecturerId: 1,
    lecturerName: "Rensuke Kunigami",
    studentCount: 45,
    status: "Đang mở",
    description: `<p><strong>Khóa học JavaScript cơ bản</strong> dành cho người mới bắt đầu. Học viên sẽ được học từ kiến thức cơ bản đến nâng cao về JavaScript.</p>
                  <ul>
                    <li>Biến, hàm, vòng lặp</li>
                    <li>DOM manipulation</li>
                    <li>ES6+ features</li>
                  </ul>`,
    createdAt: "2024-01-15",
    canDelete: true
  },
  {
    id: 2,
    name: "ReactJS từ Zero đến Hero",
    lecturerId: 2,
    lecturerName: "Saitama",
    studentCount: 128,
    status: "Đang mở",
    description: `<div class="course-desc">
                    <h3>Khóa học ReactJS chuyên sâu</h3>
                    <p>Học React từ cơ bản đến nâng cao với các chủ đề:</p>
                    <ul>
                      <li>Components & Props</li>
                      <li>State & Lifecycle</li>
                      <li>React Hooks</li>
                      <li>React Router</li>
                      <li>Redux Toolkit</li>
                    </ul>
                  </div>`,
    createdAt: "2024-02-01",
    canDelete: false
  },
  {
    id: 3,
    name: "Node.js & Express Framework",
    lecturerId: 3,
    lecturerName: "Satoju Gojo",
    studentCount: 89,
    status: "Tạm dừng",
    description: `<p>Khóa học <em>Node.js</em> và Express từ A-Z. Xây dựng API hoàn chỉnh với:</p>
                  <ul>
                    <li>RESTful API</li>
                    <li>Middleware</li>
                    <li>Authentication JWT</li>
                    <li>MongoDB Integration</li>
                  </ul>`,
    createdAt: "2024-01-20",
    canDelete: false
  },
  {
    id: 4,
    name: "Python cho Data Science",
    lecturerId: 4,
    lecturerName: "Noel Noa",
    studentCount: 0,
    status: "Đã kết thúc",
    description: `<p>Khóa học Python chuyên sâu cho Data Science đã kết thúc. Nội dung bao gồm:</p>
                  <ul>
                    <li>Pandas & NumPy</li>
                    <li>Matplotlib & Seaborn</li>
                    <li>Machine Learning cơ bản</li>
                  </ul>`,
    createdAt: "2023-12-10",
    canDelete: true
  },
  {
    id: 5,
    name: "Fullstack Web Development",
    lecturerId: 5,
    lecturerName: "Yoichi Isagi",
    studentCount: 67,
    status: "Đang mở",
    description: `<div>
                    <h4>Fullstack Web Development Bootcamp</h4>
                    <p>Trở thành Fullstack Developer trong 3 tháng:</p>
                    <ul>
                      <li>MERN Stack (MongoDB, Express, React, Node.js)</li>
                      <li>Deployment & DevOps</li>
                      <li>Real-world projects</li>
                    </ul>
                  </div>`,
    createdAt: "2024-03-01",
    canDelete: false
  },
  {
    id: 6,
    name: "CSS Grid & Flexbox Master",
    lecturerId: 2,
    lecturerName: "Saitama",
    studentCount: 23,
    status: "Đang mở",
    description: `<p>Master CSS Layout với Grid và Flexbox. Học cách tạo responsive layout chuyên nghiệp.</p>`,
    createdAt: "2024-02-15",
    canDelete: true
  },
  {
    id: 7,
    name: "Docker & Kubernetes Cơ bản",
    lecturerId: 1,
    lecturerName: "Rensuke Kunigami",
    studentCount: 12,
    status: "Tạm dừng",
    description: `<p>Khóa học Containerization với Docker và Kubernetes.</p>`,
    createdAt: "2024-02-20",
    canDelete: true
  }
];


export const getLecturerNameById = (lecturerId: number): string => {
  const lecturer = lecturers.find(l => l.id === lecturerId);
  return lecturer ? lecturer.name : "N/A";
};


export const generateNewCourseId = (): number => {
  return Math.max(...courses.map(c => c.id), 0) + 1;
};


export const isCourseNameExists = (name: string, excludeId: number | null = null): boolean => {
  return courses.some(course => 
    course.name.toLowerCase() === name.toLowerCase() && 
    course.id !== excludeId
  );
};


export default {
  COURSE_STATUS,
  lecturers,
  courses,
  getLecturerNameById,
  generateNewCourseId,
  isCourseNameExists
};