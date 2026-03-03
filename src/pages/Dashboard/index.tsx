import React from 'react';
import { Button, Col, Row, Statistic, Space, Progress, Card } from 'antd';
import { unitName } from '@/services/base/constant';
import { useModel } from 'umi';
import './components/style.less';

const Dashboard: React.FC = () => {
	const { data } = useModel('randomuser');

	return (
		<div style={{ padding: '24px' }}>
			<Card>
				<div className='home-welcome'>
					<div>
						{data && <b>{data.length} users</b>}
						<b>{data?.length || 0} users</b>
					</div>
					<h1 className='title'>THỰC HÀNH LẬP TRÌNH WEB</h1>
					<h2 className='sub-title'>{unitName?.toUpperCase()}</h2>
				</div>
			</Card>

			{/* Statistics Grid */}
			<Row gutter={[16, 16]}>
				<Col span={12}>
					<Statistic title='Active Users' value={112893} />
				</Col>
				<Col span={12}>
					<Statistic title='Account Balance (CNY)' value={112893} precision={2} />
					<Button style={{ marginTop: 16 }} type='primary'>
						Recharge
					</Button>
				</Col>
				<Col span={12}>
					<Statistic title='Pending Verification' value={112893} loading />
				</Col>
			</Row>

			{/* Progress Section */}
			<div style={{ marginTop: 24 }}>
				<Space direction='vertical' size='small'>
					<Progress percent={30} />
					<Progress percent={50} status='active' />
					<Progress percent={70} status='exception' />
					<Progress percent={100} />
					<Progress percent={50} showInfo={false} />
				</Space>
			</div>
		</div>
	);
};

export default Dashboard;
