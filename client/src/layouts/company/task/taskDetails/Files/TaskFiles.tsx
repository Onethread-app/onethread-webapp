import React from 'react';

import DownloadIcon from 'resources/images/Download.svg';

const TaskFiles = () => {
  const [showDelete, setShowDelete] = React.useState(false);
  return (
    <div>
      <h1 className="f6">Shared Files</h1>
      <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
        <div
          className="flex items-center justify-between pr2"
          onMouseEnter={() => setShowDelete(true)}
          onMouseLeave={() => setShowDelete(false)}
        >
          <h1
            className="f6 fw4 w-80"
            style={{
              wordBreak: 'break-word',
              wordWrap: 'break-word',
            }}
          >
            {/* {file.s3Key.split('/')[1]}
             */}
            Screenshot from 2021-03-18 14-56-27.png
          </h1>
          <div className="flex items-center">
            {showDelete && (
              <div
                style={{ fontSize: '23px', paddingTop: '7px' }}
                className="blue pointer"
              >
                &#735;
              </div>
            )}
            <a
              // href={file.link}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <span className="flex pl3">
                <img
                  src={DownloadIcon}
                  alt="Download icon"
                  style={{
                    width: '23px',
                    height: '23px',
                  }}
                />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFiles;
