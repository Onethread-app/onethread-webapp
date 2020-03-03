import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Card } from '@blueprintjs/core';
import addIcon from '../../../resources/images/addIcon.png';
import { RightSidebar } from 'components/RightSidebar';
import { FormProject } from './CreateProjectForm';

const ProjectPageComponent = () => {
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const projectType = [
		{ _id: 'singleDepartment', name: 'Single Department' },
		{ _id: 'multipleDepartment', name: 'Multiple Department' },
		{ _id: 'associates', name: 'Associates' }
	];
  return (
    <>
      <div >
        <h3 className="f3 ph4">
          My Projects
		    </h3>
        <div className="overflow-auto pa4">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 265px))',
              gridTemplateRows: 'repeat(2, 135px)',
              gridGap: '10px 10px'
            }}>
            <Card
              className="h-100"
              interactive={true}
              onClick={async (e) => {
                e.preventDefault();
                // const currentBoard: any = await props.getSelectedBoard(board._id);
                // if (currentBoard._id) {
                // 	props.history.push(`/company/${props.company.name}/board/${currentBoard._id}`);
                // }
              }}
              style={{ paddingLeft: '0px', paddingBottom: '0px' }}
            >
              <div
                className=""
                style={{
                  // borderLeft: `5px solid 
                  // ${find(boardColor, ['code', board.color]) ?
                  // 		find(boardColor, ['code', board.color])!.value : 'white'
                  // 	}`, // TODO use dictionary
                  borderLeft: '5px solid red',
                  paddingLeft: '20px',
                  marginLeft: '-2px',
                  borderRadius: '3px'
                }}
              >
                <h3 className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f5"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                  {/* {board.name} */}
                  Labiba
						</h3>
                <h3 className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f7 silver"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                  {/* {board.name} */}
                  By Labiba
						</h3>
              </div>
              <div className="flex pt3 pr3" style={{ justifyContent: 'space-between', paddingLeft: '20px' }}>
                <div>
                  <p className="mb0 ws-break" style={{ fontSize: '0.7rem' }}>
                    Assigned Members
							</p>
                  <p className="fw8">
                    {/* {board.members ? board.members.length : 0} */}
                    15
							</p>
                </div>
              </div>
            </Card>
          </div>
          <div>
            <img
              onClick={() => setShowProjectDialog(!showProjectDialog)}
              src={addIcon}
              className={`fixed pointer ${showProjectDialog ? 'dn' : 'db'}`}
              style={{
                bottom: '5rem',
                right: '7rem',
                width: '5rem',
                boxShadow: '0px 6px 6px #00000029',
                borderRadius: '50%'
              }}
            />
          </div>
        </div>
      </div>
      {showProjectDialog && (
        <RightSidebar
          onClose={() => setShowProjectDialog(!showProjectDialog)}
        >
          <FormProject setShowProjectDialog={setShowProjectDialog} 
          projectType={projectType}/>
        </RightSidebar>
      )}
    </>
  );
};

export const ProjectPage = connect(null, null)(ProjectPageComponent);