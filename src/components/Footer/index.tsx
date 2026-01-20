import { landingUrl, unitName } from '@/services/base/constant';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
	const defaultMessage = 'Bản quyền'; // Replaced intl.formatMessage with static string

	return (
		<DefaultFooter
			copyright={`2025 ${defaultMessage} - ${APP_CONFIG_APP_VERSION}`}
			links={[
				{
					key: 'github',
					title: unitName.toUpperCase(),
					href: landingUrl,
					blankTarget: true,
				},
			]}
			style={{ width: '100%' }}
		/>
	);
};
