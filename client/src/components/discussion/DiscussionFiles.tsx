import { SharedFile } from './SharedFile/Index';

interface Props {}

const DiscussionFiles = (props: Props) => {
  return (
    <div className="flex flex-column pa2 pl3">
      <SharedFile />
    </div>
  );
};

export default DiscussionFiles;
