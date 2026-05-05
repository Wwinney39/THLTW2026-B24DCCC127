import component from "@/locales/en-US/component";
import OrderedListOutlined from "@ant-design/icons/lib/icons/OrderedListOutlined";

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/Login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
    ],
  },

  ///////////////////////////////////
  // DEFAULT MENU
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: './TrangChu',
    icon: 'HomeOutlined',
  },
  {
    path: '/gioi-thieu',
    name: 'About',
    component: './TienIch/GioiThieu',
    hideInMenu: true,
  },
  {
    path: '/random-user',
    name: 'RandomUser',
    component: './RandomUser',
    icon: 'ArrowsAltOutlined',
  },
  {
    path: '/todo-list',
    name: 'TodoList',
    icon: 'OrderedListOutlined',
    component: './TodoList',
  },
  {
    path: '/booking',
    name: 'Quản lý Booking',
    icon: 'CalendarOutlined',
    routes: [
      {
        path: '/booking/main',
        name: 'Giao diện chính',
        icon: 'CalendarOutlined',
        component: './Booking/Booking', // Chạy file Booking.tsx
      },
      {
        path: '/booking/appointment-list',
        name: 'Danh sách hẹn',
        icon: 'OrderedListOutlined',
        component: './Booking/AppointmentList', // Chạy AppointmentList.tsx
      },
      {
        path: '/booking/management',
        name: 'Điều hành Booking',
        icon: 'SolutionOutlined',
        component: './Booking/BookingManagement', // Chạy BookingManagement.tsx
      },
      {
        path: '/booking/service',
        name: 'Quản lý dịch vụ',
        icon: 'SolutionOutlined',
        component: './Booking/ServiceManagement', // Chạy ServiceManagement.tsx
      },
      {
        path: '/booking/staff',
        name: 'Quản lý nhân viên',
        icon: 'UserOutlined',
        component: './Booking/StaffManagement', // Chạy StaffManagement.tsx
      },
      {
        path: '/booking/statistics',
        name: 'Thống kê',
        icon: 'BarChartOutlined',
        component: './Booking/Statistics', // Chạy Statistics.tsx
      },
    ],
  },
  {
    path: '/diplomaSystem',
    name: 'Quản lý bằng cấp',
    icon: 'BookOutlined',
    routes: [
      {
        path: '/diplomaSystem/cap-bang',
        name: 'Cấp bằng',
        icon: 'FileAddOutlined',
        component: './DiplomaSystem/BookManagement',
      },
      {
        path: '/diplomaSystem/tra-cuu',
        name: 'Tra cứu',
        icon: 'SearchOutlined',
        component: './DiplomaSystem/TraCuuPage',
      },
      {
        path: '/diplomaSystem/cau-hinh',
        name: 'Cấu hình',
        icon: 'SettingOutlined',
        component: './DiplomaSystem/ConfigFields',
      },
      {
        path: '/diplomaSystem/quan-ly-so',
        name: 'Quản lý sổ & QĐ',
        icon: 'BookOutlined',
        component: './DiplomaSystem/QuanLySoVanBangPage',
      },
    ],
  },


  {
    path: '/club-management',
    name: 'Quản lý câu lạc bộ',
    icon: 'TeamOutlined',
    routes: [
      {
        path: '/club-management/club-list',
        name: 'Danh sách câu lạc bộ',
        icon: 'TeamOutlined',
        component: './ClubManagement/ClubList',
      },
      {
        path: '/club-management/member-applications',
        name: 'Quản lý đơn đăng ký thành viên',
        icon: 'SearchOutlined',
        component: './ClubManagement/MemberApplications',
      },
      {
        path: '/club-management/member-management',
        name: 'Quản lý thành viên câu lạc bộ',
        icon: 'UserOutlined',
        component: './ClubManagement/MemberManagement',
      },
      {
        path: '/club-management/reports',
        name: 'Báo cáo và thống kê',
        icon: 'BookOutlined',
        component: './ClubManagement/Reports',
      },
    ],
  },
  {
    path: '/travel',
    name: 'Kế hoạch du lịch ',
    icon: 'CompassOutlined',
    routes: [
      {
        path: '/travel/discover',
        name: 'Khám phá',
        icon: 'SearchOutlined',
        component: './Travel/Discover',
      },
      {
        path: '/travel/plan',
        name: 'Tạo lịch trình',
        icon: 'ScheduleOutlined',
        component: './Travel/Plan',
      },
      {
        path: '/travel/budget',
        name: 'Quản lý ngân sách',
        icon: 'PieChartOutlined',
        component: './Travel/Budget',
      },
      {
        path: '/travel/admin',
        name: 'Quản trị điểm đến',
        icon: 'SettingOutlined',
        component: './Travel/Admin',
      },
    ],
  },

  {
    path: '/onlineCourse',
    name: 'Quản lý khóa học Online ',
    icon: 'BookOutlined',
    routes: [
      {
        path: '/onlineCourse/list-manager',
        name: 'Danh sách khóa học',
        icon: 'OrderedListOutlined',
        component: './OnlineCourse/ListManager',
      },
      {
        path: '/onlineCourse/plan',
        name: 'Mô tả khóa học',
        icon: 'FileTextOutlined',
        component: './OnlineCourse/Plan',
      },
      {
        path: '/onlineCourse/admin',
        name: 'Quản trị khóa học',
        icon: 'SettingOutlined',
        component: './OnlineCourse/Admin',
      },
    ],
  },


  {
    path: '/blog',
    name: 'Ứng dụng Blog',
    icon: 'ReadOutlined',
    routes: [
      {
        path: '/blog/home',
        name: 'Trang chủ',
        icon: 'HomeOutlined',
        component: './Blog/Home',
      },
      {
        path: '/blog/post-list',
        name: 'Chi tiết bài viết',
        icon: 'OrderedListOutlined',
        component: './Blog/PostList',
      },
      {
        path: '/blog/introduction',
        name: 'Giới thiệu',
        icon: 'FileTextOutlined',
        component: './Blog/Introduction',
      },
      {
        path: '/blog/admin',
        name: 'Quản trị bài viết    ',
        icon: 'SettingOutlined',
        component: './Blog/Admin',
      },
      {
        path: '/blog/tag-management',
        name: 'Quản trị thẻ',
        icon: 'TagOutlined',
        component: './Blog/TagManagement',
      },
    ],
  },



  {
    path: '/fitness',
    name: 'Theo dõi Sức khỏe',
    icon: 'HeartOutlined',
    routes: [
      {
        path: '/fitness/dashboard',
        name: 'Trang chủ',
        icon: 'DashboardOutlined',
        component: './Fitness/Dashboard',
      },
      {
        path: '/fitness/workout-log',
        name: 'Nhật ký tập luyện',
        icon: 'FireOutlined',
        component: './Fitness/WorkoutLog',
      },
      {
        path: '/fitness/health-metrics',
        name: 'Chỉ số sức khỏe',
        icon: 'LineChartOutlined',
        component: './Fitness/HealthMetrics',
      },
      {
        path: '/fitness/goals',
        name: 'Quản lý mục tiêu',
        icon: 'TrophyOutlined',
        component: './Fitness/GoalManagement',
      },
      {
        path: '/fitness/exercise-library',
        name: 'Thư viện bài tập',
        icon: 'BookOutlined',
        component: './Fitness/ExerciseLibrary',
      },
    ],
  },



  {
    path: '/todo',
    name: 'Theo dõi Công việc',
    icon: 'HomeOutlined',
    routes: [
      {
        path: '/todo/dashboard',
        name: 'Trang chủ',
        icon: 'DashboardOutlined',
        component: './ToDo/Dashboard',
      },
      {
        path: '/todo/kanban-board',
        name: 'KanbanBoard',
        icon: 'kanban',
        component: './ToDo/KanbanBoard',
      },
      {
        path: '/todo/task-list',
        name: 'Danh Sách Task',
        icon: 'LineChartOutlined',
        component: './ToDo/TaskList',
      },
    ],
  },



  // DANH MUC HE THONG
  // {
  // 	name: 'DanhMuc',
  // 	path: '/danh-muc',
  // 	icon: 'copy',
  // 	routes: [
  // 		{
  // 			name: 'ChucVu',
  // 			path: 'chuc-vu',
  // 			component: './DanhMuc/ChucVu',
  // 		},
  // 	],
  // },


  {
    path: '/notification',
    routes: [
      {
        path: './subscribe',
        exact: true,
        component: './ThongBao/Subscribe',
      },
      {
        path: './check',
        exact: true,
        component: './ThongBao/Check',
      },
      {
        path: './',
        exact: true,
        component: './ThongBao/NotifOneSignal',
      },
    ],
    layout: false,
    hideInMenu: true,
  },
  {
    path: '/',
  },
  {
    path: '/403',
    component: './exception/403/403Page',
    layout: false,
  },
  {
    path: '/hold-on',
    component: './exception/DangCapNhat',
    layout: false,
  },
  {
    component: './exception/404',
  },
];
