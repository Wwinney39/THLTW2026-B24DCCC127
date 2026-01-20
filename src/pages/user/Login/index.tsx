import Footer from '@/components/Footer';
import LoginWithKeycloak from '@/pages/user/Login/KeycloakLogin';
import { adminlogin, getUserInfo } from '@/services/base/api';
import { keycloakAuthority } from '@/utils/ip';
import rules from '@/utils/rules';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import styles from './index.less';

const Login: React.FC = () => {
	const [count, setCount] = useState<number>(Number(localStorage?.getItem('failed')) || 0);
	const [submitting, setSubmitting] = useState(false);
	const [type, setType] = useState<string>('account');
	const { initialState, setInitialState } = useModel('@@initialState');
	const [isVerified, setIsverified] = useState<boolean>(true);
	const [visibleCaptcha, setVisibleCaptcha] = useState<boolean>(false);
	const [form] = Form.useForm();

	/**
	 * Xử lý token, get info sau khi đăng nhập
	 */
	const handleRole = async (role: { access_token: string; refresh_token: string }) => {
		localStorage.setItem('token', role?.access_token);
		localStorage.setItem('refreshToken', role?.refresh_token);

		const info = await getUserInfo();
		setInitialState({
			...initialState,
			currentUser: info?.data?.data,
		});

		message.success('Đăng nhập thành công');
		history.push('/dashboard');
	};

	const handleSubmit = async (values: { login: string; password: string }) => {
		try {
			if (!isVerified) {
				message.error('Vui lòng xác thực Captcha');
				return;
			}
			setSubmitting(true);
			const msg = await adminlogin({ ...values, username: values?.login ?? '' });
			if (msg.status === 200 && msg?.data?.data?.accessToken) {
				handleRole(msg?.data?.data);
				localStorage.removeItem('failed');
			}
		} catch (error) {
			if (count >= 4) {
				setIsverified(false);
				setVisibleCaptcha(!visibleCaptcha);
			}
			setCount(count + 1);
			localStorage.setItem('failed', (count + 1).toString());
			message.error('Đăng nhập thất bại');
		}
		setSubmitting(false);
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.top}>
					<div className={styles.header}>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<img alt='logo' className={styles.logo} src='/logo-full.svg' />
						</div>
					</div>
				</div>

				<div className={styles.main}>
					<Tabs activeKey={type} onChange={setType}>
						<Tabs.TabPane key='account' tab='Đăng nhập tài khoản' />
					</Tabs>

					{type === 'account' ? (
						<LoginWithKeycloak />
					) : type === 'accountAdmin' ? (
						<Form
							form={form}
							onFinish={async (values) => handleSubmit(values as { login: string; password: string })}
							layout='vertical'
						>
							<Form.Item label='' name='login' rules={[...rules.required]}>
								<Input
									placeholder='Nhập tên đăng nhập'
									prefix={<UserOutlined className={styles.prefixIcon} />}
									size='large'
								/>
							</Form.Item>
							<Form.Item label='' name='password' rules={[...rules.required]}>
								<Input.Password
									placeholder='Nhập mật khẩu'
									prefix={<LockOutlined className={styles.prefixIcon} />}
									size='large'
								/>
							</Form.Item>

							<Button type='primary' block size='large' loading={submitting}>
								Đăng nhập
							</Button>
						</Form>
					) : null}

					<br />
					<div style={{ textAlign: 'center' }}>
						<Button
							onClick={() => {
								window.open(keycloakAuthority + '/login-actions/reset-credentials');
							}}
							type='link'
						>
							Quên mật khẩu?
						</Button>
					</div>
				</div>
			</div>

			<div className='login-footer'>
				<Footer />
			</div>
		</div>
	);
};

export default Login;
