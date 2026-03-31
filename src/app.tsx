import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { notification } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig } from 'umi';
import { history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import { Provider } from 'react-redux';
import ErrorBoundary from './components/ErrorBoundary';
// import LoadingPage from './components/Loading';
import { OIDCBounder } from './components/OIDCBounder';
import { unCheckPermissionPaths } from './components/OIDCBounder/constant';
import OneSignalBounder from './components/OneSignalBounder';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import type { IInitialState } from './services/base/typing';
import { store } from './models/store';
import './styles/global.less';
import { currentRole } from './utils/ip';

/**  loading */
export const initialStateConfig = {
	loading: <></>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * // Tobe removed
 * */
export async function getInitialState(): Promise<IInitialState> {
	return {
		permissionLoading: true,
	};
}

// Tobe removed
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => ({});

/**
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
	errorHandler: (error: ResponseError) => {
		const { response } = error;

		if (response && response.status) {
			const { status, statusText, url } = response;
			const errorMessage = `Request error ${status}: ${url}`;
			const errorDescription = statusText || 'An error occurred';

			notification.error({
				message: errorMessage,
				description: errorDescription,
			});
		} else {
			notification.error({
				description: 'Yêu cầu gặp lỗi',
				message: 'Bạn hãy thử lại sau',
			});
		}
		throw error;
	},
	requestInterceptors: [authHeaderInterceptor],
};

// ProLayout  https://procomponents.ant.design/components/layout
interface InitialState {
	currentUser?: any;
	authorizedPermissions?: { rsname: string }[];
	settings?: any;
}

// Updated layout configuration to ensure compatibility with umi
export const layout = ({ initialState }: { initialState: InitialState }) => {
	return {
		unAccessible: (
			<OIDCBounder>
				<TechnicalSupportBounder>
					<NotAccessible />
				</TechnicalSupportBounder>
			</OIDCBounder>
		),
		noFound: <NotFoundContent />,
		rightContentRender: () => <RightContent />,
		disableContentMargin: false,

		footerRender: () => <Footer />,

		onPageChange: () => {
			if (initialState?.currentUser) {
				const { location } = history;
				const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));

				if (location.pathname === '/') {
					history.replace('/dashboard');
				} else if (
					!isUncheckPath &&
					currentRole &&
					initialState?.authorizedPermissions?.length &&
					!initialState?.authorizedPermissions?.find((item: { rsname: string }) => item.rsname === currentRole)
				)
					history.replace('/403');
			}
		},

		menuItemRender: (item: any, dom: any) => (
			<a
				className='not-underline'
				key={item?.path}
				href={item?.path}
				onClick={(e) => {
					e.preventDefault();
					history.push(item?.path ?? '/');
				}}
				style={{ display: 'block' }}
			>
				{dom}
			</a>
		),

		childrenRender: (dom: React.ReactNode) => (
			<Provider store={store}>
				<OIDCBounder>
					<ErrorBoundary>
						<OneSignalBounder>{dom}</OneSignalBounder>
					</ErrorBoundary>
				</OIDCBounder>
			</Provider>
		),
		menuHeaderRender: undefined,
		...initialState?.settings,
	};
};
