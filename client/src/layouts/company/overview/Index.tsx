import Axios from 'axios';
import { Loading } from 'components/Loading';
import { server } from 'config';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tokenConfig } from 'stores/UtilsActions';
import './index.scss';
import Table from './Table/Table';

const ProjectInfo = ({
  context,
  data,
  containerStyle = {},
  dataStyle = {},
  dataClassName = '',
}) => {
  return (
    <p
      style={{
        fontSize: 18.5,
        fontWeight: 'bold',
        ...containerStyle,
      }}
    >
      {context}
      <span
        style={{ fontWeight: 'normal', ...dataStyle }}
        className={dataClassName}
      >
        {data}
      </span>
    </p>
  );
};

const getDate = (time) => {
  let today = new Date(time);
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();

  return dd + '/' + mm + '/' + yyyy;
};

type Order = 'asc' | 'desc';
interface Data {
  name: string;
  status: string;
  dueDate: string;
  assign: string;
  priority: string;
}

const Index = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');
  const [lead, setLead] = useState('');
  const [startingDate, setStartingDate] = useState('');

  const [tasks, setTasks] = useState<any[]>([]);

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('dueDate');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  let { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    setIsLoading(true);

    const headers = tokenConfig();
    Axios.get(`${server}projects/${projectId}/tasks`, headers)
      .then((res) => {
        const { tasks, project } = res.data.response;

        setName(project.name);
        setDueDate(project.dueDate);
        setStatus(project.status);
        setLead(project.lead);
        setStartingDate(getDate(project.startingDate));

        setTasks(tasks);

        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="ph5">
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div>
            <h1>
              Project name:{' '}
              <span style={{ fontWeight: 'normal' }}>{name}</span>
            </h1>
          </div>
          <div>
            <ProjectInfo
              context="Starting date: "
              data={startingDate}
            />
            <ProjectInfo
              context="End date: "
              data={dueDate ? dueDate : 'N/A'}
            />
            <ProjectInfo context="Lead: " data={lead} />
            <ProjectInfo
              context="Status: "
              data={status}
              dataStyle={{
                fontWeight: 'normal',
                backgroundColor: '#fca11c',
                marginLeft: 5,
                color: 'white',
                borderRadius: 2,
                fontSize: 16.5,
              }}
              dataClassName="ph2 pv1"
            />
          </div>
          <>
            {!tasks.length ? (
              <div className="tc pt3">
                <h2>No tasks available</h2>
              </div>
            ) : (
              <>
                <Table
                  order={order}
                  setOrder={setOrder}
                  orderBy={orderBy}
                  setOrderBy={setOrderBy}
                  selected={selected}
                  setSelected={setSelected}
                  page={page}
                  setPage={setPage}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                  tasks={tasks}
                />
              </>
            )}
          </>
        </div>
      )}
    </div>
  );
};

export const OverviewPage = Index;
