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
    icon: 'BookingOutlined',
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
