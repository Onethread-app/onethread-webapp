import { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
  useTable,
  useGlobalFilter,
  useFilters,
  useSortBy,
  useAsyncDebounce,
  usePagination,
  useRowSelect,
} from 'react-table';

import { ColleagueTableColumns } from './ColleagueTableColumns';

import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Container,
  HeaderContainer,
  Header,
  SortAndFilter,
  StyledInput,
  StyledFilterPopover,
} from 'components/table/StyledTable.styles';
import { AlignCenter } from 'components/UtilComponents';
import ColleaguesTable from './ColleaguesTable';
import ColleagueTableSkeleton from './ColleagueTableSkeleton';
import IndeterminateCheckbox from 'components/table/IndeterminateCheckbox';
import { Position } from '@blueprintjs/core';
import { ICompanyMembers } from 'stores/company/Reducer';
import { SimpleButton } from 'components/announcement/AnnouncementDialog.styles';
import { DangerButton } from 'components/project/Project.styles';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import {
  errorToaster,
  successToaster,
} from 'components/toast/Toaster';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import { getCompanyMembers } from 'stores/company/Actions';

interface ICompanyProjects {
  gettingCompanyDetails: boolean;
  uniqueCompanyName: string;
  currentCompanyId: string;
  colleagues: ICompanyMembers[];
  getCompanyMembers: () => void;
}

const Colleagues = (props: ICompanyProjects) => {
  const { colleagues } = props;
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [header, setHeader] = useState<string>('All');
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [showInputField, setShowInputField] =
    useState<boolean>(false);
  const [tableData, setTableData] = useState(colleagues);
  const [joinedColleagues, setJoinedColleagues] = useState<
    ICompanyMembers[]
  >([]);
  const [pendingColleagues, setPendingColleagues] = useState<
    ICompanyMembers[]
  >([]);
  const [invitedColleagues, setInvitedColleagues] = useState<
    ICompanyMembers[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const data = useMemo(() => tableData, [tableData]);
  const columns = useMemo(() => ColleagueTableColumns, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    allColumns,
    state,
    setGlobalFilter,
    page,
    setPageSize,
    gotoPage,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize:
          window.innerHeight > 1079
            ? 12
            : window.innerHeight > 800
            ? 8
            : 6,
        hiddenColumns: ['division', 'position'],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox
                {...getToggleAllRowsSelectedProps()}
              />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps()}
              />
            </div>
          ),
        },
        ...columns,
      ]);
    },
  );

  const { globalFilter, pageSize, pageIndex } = state;

  const handleSearchChange = useAsyncDebounce((e) => {
    setGlobalFilter(e.target.value || undefined);
  }, 500);

  useEffect(() => {
    setJoinedColleagues(
      colleagues.filter((colleague) => colleague.type === 'joined'),
    );
    setPendingColleagues(
      colleagues.filter((colleague) => colleague.type === 'pending'),
    );
    setInvitedColleagues(
      colleagues.filter((colleague) => colleague.type === 'invited'),
    );
  }, [colleagues]);

  const updateData = useCallback(() => {
    if (header === 'All') {
      setTableData(colleagues);
    }
    if (header === 'Joined') {
      setTableData(joinedColleagues);
    }
    if (header === 'Invited') {
      setTableData(invitedColleagues);
    }
    if (header === 'Requested') {
      setTableData(pendingColleagues);
    }
  }, [header, colleagues]);

  useEffect(() => {
    setLoadingData(true);
    updateData();
    setLoadingData(false);
  }, [header]);

  const acceptInvitedColleagues = () => {
    setLoading(true);
    const members = selectedFlatRows.map((row) => row.original.id);
    try {
      const headers = tokenConfig();
      tigrowApi.post(
        `/company/${props.currentCompanyId}/members/accept-request`,
        { member: members },
        headers,
      );
      props.getCompanyMembers();
      successToaster(
        `${members.length} ${
          members.length > 1 ? 'members were' : 'member was'
        } accepted successfully.`,
      );
    } catch (error) {
      errorToaster(returnErrorText(error));
    }
    setLoading(false);
  };

  const rejectInvitedColleagues = () => {
    setLoading(true);
    const members = selectedFlatRows.map((row) => row.original.id);
    try {
      const headers = tokenConfig();
      tigrowApi.post(
        `/company/${props.currentCompanyId}/members/reject-request`,
        { member: members },
        headers,
      );
      props.getCompanyMembers();
      successToaster(
        `${members.length} ${
          members.length > 1 ? 'members were' : 'member was'
        } rejected successfully.`,
      );
    } catch (error) {
      errorToaster(returnErrorText(error));
    }
    setLoading(false);
  };

  return (
    <Container>
      <HeaderContainer>
        <Header className="flex items-center">
          {header} <span className="ml2">({tableData.length})</span>
          <Popover
            position={Position.BOTTOM}
            isOpen={showPopover}
            canEscapeKeyClose={true}
            onClose={() => setShowPopover(false)}
            content={
              <div className="pa3 pr4">
                <div
                  onClick={() => {
                    setTableData(colleagues);
                    setHeader('All');
                    setShowPopover(false);
                  }}
                  className="mt1 mb2 pointer"
                >
                  All{' '}
                  {colleagues.length > 0 ? (
                    <span>({colleagues.length})</span>
                  ) : null}
                </div>
                <div
                  onClick={() => {
                    setHeader('Joined');
                    setShowPopover(false);
                  }}
                  className="mt1 mb2 pointer"
                >
                  Joined <span>({joinedColleagues.length})</span>
                </div>
                <div
                  onClick={() => {
                    setHeader('Invited');
                    setShowPopover(false);
                  }}
                  className="mt1 mb2 pointer"
                >
                  Invited <span>({invitedColleagues.length})</span>
                </div>
                <div
                  onClick={() => {
                    setHeader('Requested');
                    setShowPopover(false);
                  }}
                  className="mt1 mb2 pointer"
                >
                  Requested <span>({pendingColleagues.length})</span>
                </div>
              </div>
            }
            target={
              <ExpandMoreIcon
                className="mt1 pointer"
                onClick={() => setShowPopover(true)}
              />
            }
          />
          {selectedFlatRows.length > 0 ? (
            <div>
              {header === 'Requested' ? (
                <div className="flex items-center ml3">
                  <SimpleButton
                    className="mr3"
                    onClick={() => acceptInvitedColleagues()}
                    disabled={loading}
                  >
                    Accept
                  </SimpleButton>
                  <DangerButton
                    onClick={() => rejectInvitedColleagues()}
                    disabled={loading}
                  >
                    Reject
                  </DangerButton>
                </div>
              ) : null}
            </div>
          ) : null}
        </Header>
        <SortAndFilter>
          <ClickAwayListener
            onClickAway={() => {
              if (globalFilter === '' || globalFilter === undefined) {
                setShowInputField(false);
              }
            }}
          >
            <AlignCenter onClick={() => setShowInputField(true)}>
              {showInputField ? (
                <StyledInput onChange={handleSearchChange} />
              ) : (
                <Icon icon="search" />
              )}
              Search
            </AlignCenter>
          </ClickAwayListener>
          <Popover
            interactionKind="click"
            position="bottom-right"
            content={
              <StyledFilterPopover>
                <p className="bb">Customize Table</p>
                {allColumns.map((column) =>
                  column.id !== 'selection' ? (
                    <div key={column.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={column.isVisible}
                          disabled={column.id === 'name'}
                          {...column.getToggleHiddenProps()}
                        />{' '}
                        {column.Header}
                      </label>
                    </div>
                  ) : null,
                )}
              </StyledFilterPopover>
            }
            target={<MoreVertIcon fontSize="small" />}
          />
        </SortAndFilter>
      </HeaderContainer>
      {colleagues.length === 0 ? (
        loadingData ? (
          <ColleagueTableSkeleton />
        ) : (
          // ) : error ? (
          //   <div className="mt3">{error}</div>
          <div className="mt3">No Colleague. </div>
        )
      ) : (
        <ColleaguesTable
          getTableProps={getTableProps}
          getTableBodyProps={getTableBodyProps}
          headerGroups={headerGroups}
          rows={rows}
          prepareRow={prepareRow}
          visibleColumns={visibleColumns}
          page={page}
          gotoPage={gotoPage}
          pageSize={pageSize}
          pageIndex={pageIndex}
          setPageSize={setPageSize}
        />
      )}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
  currentCompanyId: state.companyReducer.currentCompany._id,
  gettingCompanyDetails: state.companyReducer.gettingCompanyDetails,
});

export default connect(mapStateToProps, {
  getCompanyMembers,
})(Colleagues);
