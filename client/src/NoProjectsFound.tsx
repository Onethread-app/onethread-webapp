import { useTranslation } from 'react-i18next';

const NoProjectsFound = () => {
  const { t } = useTranslation();
  return (
    <div className='tc mt4 mb5 ttc'>
      <h1 style={{ color: '#34495E' }}>
        {t('app.company.Projects.No-projects-found')}
      </h1>
    </div>
  );
};

export default NoProjectsFound;
