import { useEffect, useMemo } from 'react';
import {
  // Link,
  //   NavLink,
  useHistory,
} from 'react-router-dom';

import {
  withStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { isNil } from 'lodash';

interface StyledTabProps {
  label: string;
  value?: number;
  tab?: number;
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
)((props: StyledTabProps) => {
  const history = useHistory();
  const tab = useMemo(() => props.tab, [props.tab]);

  useEffect(() => {
    !isNil(tab) &&
      history.replace(`${history.location.pathname}?tab=${tab}`);
  }, [tab]);

  return <Tab disableRipple {...props} />;
});
