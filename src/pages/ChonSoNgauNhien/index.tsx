import React, { useState, useEffect } from 'react';
import {
	Progress,
	Typography,
	Card,
	List,
	message,
	Button,
	Space,
	Modal,
	Form,
	Input,
	InputNumber,
	Popconfirm,
} from 'antd';
import { ReloadOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ChonSoNgauNhien = () => {
	const [number, setNumbers] = useState<number>(0);
	const [guess, setGuess] = useState<number | null>(null);
	const [attempts, setAttempts] = useState<number>(0);
	const [loading, setLoading] = useState(false);
	const [history, setHistory] = useState<number[]>([]);

	const init = () => {
		setNumbers(Math.floor(Math.random() * 100) + 1);
		setGuess(null);
		setAttempts(10);
		setLoading(false);
		setHistory([]);
	};
	useEffect(() => {
		init();
	}, []);

	const GussingGame = () => {
		if (guess === null) {
			message.warning('Vui lòng nhập một số!');
			return;
		}
		setLoading(true);
		setTimeout(() => {
			if (guess === number) {
				message.success(`Chúc mừng! Bạn đoán đúng số ${number}!`);
				init();
			} else {
				const newAttempts = attempts - 1;
				setAttempts(newAttempts);
				setHistory((prev) => [guess, ...prev]);

				if (newAttempts === 0) {
					message.error(`Bạn đã hết lượt! Số đúng là ${targetNumber}.`);
					init();
				} else {
					const hint = guess < number ? 'Thấp quá!' : 'Cao quá!';
					message.info(`${hint} Bạn còn ${newAttempts} lượt.`);
				}
			}
			setLoading(false);
			setGuess(null);
		}, 500);
	};
	return (
		<div>
			<Card style={{ width: 400, textAlign: 'center' }}>
				<Space direction='vertical' size='large' style={{ width: '100%' }}>
					<Title level={2}>🎮 Đoán Số</Title>

					<Progress
						type='dashboard'
						percent={attempts * 10}
						format={() => `${attempts} lượt`}
						status={attempts < 4 ? 'exception' : 'normal'}
					/>

					<Space>
						<InputNumber
							min={1}
							max={100}
							value={guess}
							onChange={(val) => setGuess(val)}
							placeholder='Nhập số...'
							size='large'
							disabled={loading}
							onPressEnter={GussingGame}
						/>
						<Button type='primary' icon={<RocketOutlined />} onClick={GussingGame} loading={loading} size='large'>
							Đoán
						</Button>
					</Space>

					<Button icon={<ReloadOutlined />} onClick={init} type='link'>
						Làm mới game
					</Button>

					<List
						header={<div>Lịch sử đoán:</div>}
						bordered
						dataSource={history}
						locale={{ emptyText: 'Chưa có lượt đoán nào!' }}
						size='small'
						renderItem={(item) => (
							<List.Item>
								<Text delete={item !== number}>Bạn đã đoán: {item}</Text>
							</List.Item>
						)}
						style={{ maxHeight: '200px', overflowY: 'auto' }}
					/>
				</Space>
			</Card>
		</div>
	);
};
export default ChonSoNgauNhien;
