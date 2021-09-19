import { IRoomFile } from 'stores/room/Reducer';

import DownloadIcon from './../../../../../resources/images/file-download.svg';

interface SharedFileItemComponentProps {
  file: IRoomFile;
}

export const SharedFileItem = (
  props: SharedFileItemComponentProps,
) => {
  return (
    <div className="flex justify-between items-center">
      <h4
        className="mv2 flex justify-center items-center"
        style={{
          color: '#3b5998',
          whiteSpace: 'pre-wrap',
        }}
      >
        {props.file.s3Key.split('/')[1]}
      </h4>
      <a
        href={props.file.link}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        <span className="flex pr3">
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
  );
};
