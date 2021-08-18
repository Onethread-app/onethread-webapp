import React from 'react';
import { isMobileOnly } from 'react-device-detect';

import { Dialog } from '@blueprintjs/core';
import CreateProjectDialog from 'components/project/CreateProjectDialog';
import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const Projects = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchInput, setSearchInput] = React.useState('');
  const [showDialog, setShowDialog] = React.useState(false);
  const [projectList, setProjectList] = React.useState<any>([]);
  const [
    filteredProjectList,
    setFilteredProjectList,
  ] = React.useState<any>([]);

  const arrayTrim = (a) => {
    if (a.length > 10) a.length = 10;
    return a;
  };

  const getProjectLists = async () => {
    setIsLoading(true);
    const headers = tokenConfig();
    if ((headers.headers as any).Authorization) {
      const response = await tigrowApi.get(
        `projects/list/overview`,
        headers,
      );
      setProjectList([...response.data.projectList]);
      setFilteredProjectList(arrayTrim(response.data.projectList));
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getProjectLists();
  }, []);

  const handleFilter = (e) => {
    const { value } = e.target;
    setSearchInput(value);
    const lists = arrayTrim(
      projectList.filter((p) => p.name.includes(value)),
    );
    setFilteredProjectList(lists);
  };

  return (
    <>
      <div className="your-projects">
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 'bold' }}>
            My Projects
          </h3>
        </div>
        <div className="flex flex-column justify-center">
          <input
            type="text"
            className="search-project"
            placeholder="Search projects"
            value={searchInput}
            onChange={handleFilter}
          />
          {isLoading ? (
            <div
              className="flex justify-center mt2 w-100"
              style={{ paddingTop: 25, paddingBottom: 30 }}
            >
              <CircularProgress
                style={{ color: 'rgb(48, 48, 83)' }}
                size={26}
              />
            </div>
          ) : (
            <div
              style={{
                paddingTop: 10,
                paddingBottom: 15,
                paddingLeft: 5,
              }}
            >
              {filteredProjectList.map((p, i) => (
                <p
                  key={i}
                  style={{
                    paddingTop: 5,
                    paddingLeft: 5,
                    fontSize: 13.5,
                    cursor: 'pointer',
                    color: '#333',
                  }}
                  onClick={() =>
                    history.push(
                      `/company/${p.companyUniqueName}/project/${p._id}/overview`,
                    )
                  }
                >
                  <span
                    style={{
                      marginRight: 6.5,
                      fontWeight: 'bold',
                      fontSize: 12.5,
                    }}
                  >
                    #
                  </span>{' '}
                  {p.name}
                </p>
              ))}
            </div>
          )}

          <button onClick={() => setShowDialog(true)}>
            Create Project
          </button>
        </div>
      </div>
      {showDialog && (
        <Dialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          style={{
            width: isMobileOnly ? '95%' : '544px',
            maxWidth: '508px',
            height: '537px',
            background: '#ffffff',
            borderRadius: '10px',
          }}
        >
          <CreateProjectDialog
            setShowDialog={setShowDialog}
            projectList={getProjectLists}
          />
        </Dialog>
      )}
    </>
  );
};

export default Projects;
