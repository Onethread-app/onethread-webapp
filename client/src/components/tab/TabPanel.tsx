interface ITabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanel = (props: ITabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        display: value === index ? 'flex' : 'inherit',
        flexGrow: value === index ? 1 : 'inherit',
        flexDirection: value === index ? 'column' : 'inherit',
      }}
    >
      {value === index && children}
    </div>
  );
};

export default TabPanel;
