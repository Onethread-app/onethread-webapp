import {
  withStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// interface StyledTabsProps {
//   value: number;
//   onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
// }

interface StyledTabProps {
  label: string;
}

export const StyledTabs = withStyles({
  root: {
    borderTop: '1px solid #E0E0E0',
  },
  indicator: {
    top: '0px',
    backgroundColor: '#34B3E9',
    borderRadius: '1rem',
    height: '3px',
  },
})(Tabs);

export const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'capitalize',
      '&:hover': {
        color: '#34B3E9',
        opacity: 1,
      },
      '&$selected': {
        color: '#34B3E9',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: '#34B3E9',
      },
    },
    selected: {},
  }),
)((props: StyledTabProps) => <Tab disableRipple {...props} />);
