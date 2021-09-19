import { useTranslation } from 'react-i18next';

import Paper from '@material-ui/core/Paper/Paper';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableContainer from '@material-ui/core/TableContainer/TableContainer';
import { IconNames } from '@blueprintjs/icons';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import Onethread from '../../resources/images/onethread-logo-dark.png';
import Slack from '../../resources/images/companies/slack.png';
import ClickUp from '../../resources/images/companies/clickup.png';
import Asana from '../../resources/images/companies/asana.png';
import Jira from '../../resources/images/companies/jira.png';
import Trello from '../../resources/images/companies/trello.png';
import chrome from '../../resources/images/companies/chrome.png';
import firefox from '../../resources/images/companies/firefox-logo.png';
import safari from '../../resources/images/companies/safari.png';
import operamini from '../../resources/images/companies/opera-mini-logo.png';
import edge from '../../resources/images/companies/edge-logo.png';

import features from './CompaniesData.json';

import './WhyOnethread.scss';

const WhyOnethread = () => {
  const { t } = useTranslation();

  return (
    <div className="w-80 pa2">
      <h1 className="tc f2">
        {t('app.company.Pricing.Why-Onethread')}
      </h1>
      <div className="features flex justify-center">
        <h2 className="tc">{t('app.company.Pricing.Features')}</h2>
        <span></span>
      </div>
      <TableContainer component={Paper}>
        <Table className="company-table" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center">
                <img
                  className="company-logo"
                  src={Onethread}
                  alt="Onethread"
                />
              </TableCell>
              <TableCell align="center">
                <img
                  className="company-logo"
                  src={Slack}
                  alt="Slack"
                />
              </TableCell>
              <TableCell align="center">
                <img
                  className="company-logo"
                  src={ClickUp}
                  alt="ClickUp"
                />
              </TableCell>
              <TableCell align="center">
                <img
                  className="company-logo"
                  src={Asana}
                  alt="Asana"
                />
              </TableCell>
              <TableCell align="center">
                <img className="company-logo" src={Jira} alt="Jira" />
              </TableCell>
              <TableCell align="center">
                <img
                  className="company-logo"
                  src={Trello}
                  alt="Trello"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {features.map((feature, i) => (
              <TableRow key={feature.feature}>
                <TableCell align="center">
                  {feature.feature}
                </TableCell>
                <TableCell align="center">
                  {feature.onethread === 'yes' ? (
                    <Icon
                      style={{
                        color: '#007d21',
                      }}
                      icon={IconNames.TICK}
                      iconSize={20}
                      className="grow pointer pl2 pr2"
                    />
                  ) : feature.onethread === 'no' ? (
                    <Icon
                      style={{
                        color: '#d40000',
                      }}
                      icon={IconNames.CROSS}
                      iconSize={20}
                      className="grow pointer pl2 pr2"
                    />
                  ) : (
                    feature.onethread
                  )}
                </TableCell>
                <TableCell align="center">
                  {feature.slack === 'yes' ? (
                    <Icon
                      style={{
                        color: '#007d21',
                      }}
                      icon={IconNames.TICK}
                      iconSize={20}
                      className="grow pointer pl2 pr2"
                    />
                  ) : feature.slack === 'no' ? (
                    <Icon
                      style={{
                        color: '#d40000',
                      }}
                      icon={IconNames.CROSS}
                      iconSize={20}
                      className="grow pointer pl2 pr2"
                    />
                  ) : (
                    feature.slack
                  )}
                </TableCell>
                <TableCell align="center">
                  {feature.clickUp === 'yes' ? (
                    <Icon
                      style={{
                        color: '#007d21',
                      }}
                      icon={IconNames.TICK}
                      iconSize={20}
                      className="grow pointer pl2 pr2"
                    />
                  ) : feature.clickUp === 'no' ? (
                    <Icon
                      style={{
                        color: '#d40000',
                      }}
                      icon={IconNames.CROSS}
                      iconSize={20}
                      className="grow pointer pl2 pr2"
                    />
                  ) : (
                    feature.clickUp
                  )}
                </TableCell>
                <TableCell align="center">
                  {feature.asana === 'yes' ? (
                    <Icon
                      style={{
                        color: '#007d21',
                      }}
                      icon={IconNames.TICK}
                      iconSize={20}
                      className="grow pointer pl2 pr2"
                    />
                  ) : feature.asana === 'no' ? (
                    <Icon
                      style={{
                        color: '#d40000',
                      }}
                      icon={IconNames.CROSS}
                      iconSize={20}
                      className="grow pointer pl2 pr2"
                    />
                  ) : (
                    feature.asana
                  )}
                </TableCell>
                <TableCell align="center">
                  {feature.jira === 'yes' ? (
                    <Icon
                      style={{
                        color: '#007d21',
                      }}
                      icon={IconNames.TICK}
                      iconSize={20}
                      className="grow pointer pl2 pr2"
                    />
                  ) : feature.jira === 'no' ? (
                    <Icon
                      style={{
                        color: '#d40000',
                      }}
                      icon={IconNames.CROSS}
                      iconSize={20}
                      className="grow pointer pl2 pr2"
                    />
                  ) : (
                    feature.jira
                  )}
                </TableCell>
                <TableCell align="center">
                  {feature.trello === 'yes' ? (
                    <Icon
                      style={{
                        color: '#007d21',
                      }}
                      icon={IconNames.TICK}
                      iconSize={20}
                      className="grow pointer pl2 pr2"
                    />
                  ) : feature.trello === 'no' ? (
                    <Icon
                      style={{
                        color: '#d40000',
                      }}
                      icon={IconNames.CROSS}
                      iconSize={20}
                      className="grow pointer pl2 pr2"
                    />
                  ) : (
                    feature.trello
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="availabe flex justify-center mt5">
        <h2 className="tc">
          {t('app.company.Pricing.Available-on')}
        </h2>
        <span></span>
      </div>
      <div className="flex justify-center mb4 browsers">
        <img src={chrome} alt="chrome" />
        <img src={firefox} alt="firefox" />
        <img src={safari} alt="safari" />
        <img src={edge} alt="edge" />
        <img src={operamini} alt="operamini" />
      </div>
    </div>
  );
};

export default WhyOnethread;
