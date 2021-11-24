import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import {
  withStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { isNil } from 'lodash';
import useQuery from 'helpers/hooks/useQuery';

interface StyledTabProps {
  label: string;
  value?: number;
  tab?: number;
}

export const DiscussionTabs = withStyles({
  root: {},
  indicator: {
    bottom: '0px',
    backgroundColor: '#34B3E9',
    borderRadius: '1rem',
    height: '3px',
  },
})(Tabs);

export const DiscussionTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'capitalize',
      '&:hover': {
        opacity: 1,
      },
    },
  }),
)((props: StyledTabProps) => {
  const history = useHistory();
  const query = useQuery();
  const tab = useMemo(() => props.tab, [props.tab]);
  const discussionId = useMemo(() => {
    return query.get('discussion') || '0';
  }, [query]);

  useEffect(() => {
    !isNil(tab) &&
      history.replace(
        `${history.location.pathname}?ptab=3&discussion=${discussionId}&thread=${tab}`,
      );
  }, [tab]);

  return <Tab disableRipple {...props} />;
});

interface ITabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export const TabPanel = (props: ITabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        display: value === index ? 'flex' : 'none',
        overflow: 'auto',
        height: '100%',
        minHeight: '400px',
        // flexDirection: value === index ? 'column' : 'inherit',
      }}
    >
      {value === index && children}
    </div>
  );
};
