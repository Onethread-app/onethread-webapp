import { useState, useEffect, useMemo } from 'react';

import {
  Container,
  DiscussionListContainer,
} from './ProjectDiscussion.styles';
import { CreatableItem } from 'components/table/StyledTable.styles';
import {
  getRoomDiscussions,
  getRoomMembers,
  getRoomMessages,
  getRooms,
  getRoomSharedFiles,
} from 'stores/room/Actions';
import { connect, useDispatch } from 'react-redux';
import { IRoom } from 'stores/room/Reducer';

import ProjectDiscussionView from './ProjectDiscussionView';
import { CreateForm } from 'layouts/company/room/leftSidebar/Form';
import { Dialog } from '@blueprintjs/core';
import useQuery from 'helpers/hooks/useQuery';
// import { roomSubscribe } from 'layouts/company/room/channelSubscribe';
import { CHANGE_ROOM, CURRENT_ROOM } from 'stores/room/Types';
import DiscussionItem from './DiscussionItem';
import { Loading } from 'components/Loading';
import DiscussionSkeleton from './DiscussionSkeleton';
import { IProject } from 'stores/project/Reducer';
import { ICompany } from 'stores/company/Reducer';
interface IProps {
  getRooms: () => void;
  rooms: IRoom[];
  getRoomMessages: (roomId, limit, skip) => void;
  getRoomMembers: (roomId) => void;
  getRoomDiscussions: (roomId) => void;
  getRoomSharedFiles: (roomId) => void;
  companyId: string;
  gettingCompanyDetails: boolean;
  singleProjectLoading: boolean;
  roomLoading: boolean;
  projectId: string;
  currentRoom: IRoom;
  currentProject: IProject;
  currentCompany: ICompany;
}

const ProjectDiscussion = (props: IProps) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [projectDiscussionList, setProjectDiscussionList] = useState<
    IRoom[]
  >([]);
  const [showDiscussionForm, setShowDiscussionForm] =
    useState<boolean>(false);
  const [currentDiscussion, setCurrentDiscussion] = useState<IRoom>(
    [] as unknown as IRoom,
  );
  const query = useQuery();
  const discussionId = useMemo(() => {
    return query.get('discussion') || '0';
  }, [query]);
  // const [showDialog, setShowDialog] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      (props.gettingCompanyDetails ||
        props.roomLoading ||
        props.singleProjectLoading) === true
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [props.companyId, currentDiscussion?._id]);

  useEffect(() => {
    if (props.companyId) props.getRooms();
  }, [props.companyId, props.projectId]);

  useEffect(() => {
    // dispatch({ type: CHANGE_ROOM });
    setProjectDiscussionList([...props.rooms]);
    setCurrentDiscussion(
      props.rooms.find((room) => room._id === discussionId) ||
        props.rooms[0],
    );
  }, [discussionId, props.rooms]);

  useEffect(() => {
    if (searchValue) {
      const filteredList = props.rooms.filter((room) =>
        room.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setProjectDiscussionList(filteredList);
    } else {
      setProjectDiscussionList([...props.rooms]);
    }
  }, [searchValue]);

  useEffect(() => {
    if (currentDiscussion) {
      dispatch({ type: CURRENT_ROOM, payload: currentDiscussion });
    }
  }, [currentDiscussion]);

  const changeRoom = (roomId) => {
    if (roomId !== currentDiscussion._id) {
      dispatch({ type: CHANGE_ROOM });
      const room = projectDiscussionList.find(
        (room) => room._id === roomId,
      );
      dispatch({ type: CURRENT_ROOM, payload: room });
      setCurrentDiscussion(room!);
    }
  };

  useEffect(() => {
    if (loading === false && props.currentRoom._id) {
      props.getRoomMessages(props.currentRoom?._id, 15, 0);
      props.getRoomMembers(props.currentRoom?._id);
      props.getRoomSharedFiles(props.currentRoom?._id);
      props.getRoomDiscussions(props.currentRoom?._id);
    }
  }, [props.currentRoom, loading]);
  return (
    <Container>
      <div className="flex flex-column w-30">
        <span className="title">Discussions</span>
        <form>
          <input
            className="search"
            type="text"
            placeholder="Search discussion"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
        {!loading ? (
          <>
            <DiscussionListContainer>
              {projectDiscussionList.length > 0 &&
                projectDiscussionList.map((discussion: IRoom) => (
                  <DiscussionItem
                    active={discussion._id === props.currentRoom._id}
                    key={discussion._id}
                    discussion={discussion}
                    changeRoom={changeRoom}
                  />
                ))}
            </DiscussionListContainer>
            <CreatableItem
              onClick={() => setShowDiscussionForm(true)}
            >
              <span>+</span>Add new discussion
            </CreatableItem>
          </>
        ) : (
          <DiscussionSkeleton />
        )}
      </div>
      {!loading && projectDiscussionList.length > 0 ? (
        <ProjectDiscussionView />
      ) : !loading && projectDiscussionList.length === 0 ? (
        <div className="w-100 flex flex-column justify-center items-center">
          <span className="title">No discussions found</span>
        </div>
      ) : (
        <div className="flex w-100 justify-center">
          <Loading />
        </div>
      )}
      {showDiscussionForm ? (
        <Dialog
          isOpen={showDiscussionForm}
          onClose={() => setShowDiscussionForm(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="pb0 h-auto w-auto"
          style={{ backgroundColor: '#fff' }}
        >
          <CreateForm
            setShowDialog={setShowDiscussionForm}
            currentProject={props.currentProject}
            currentCompany={props.currentCompany}
          />
        </Dialog>
      ) : null}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  rooms: state.roomReducer.rooms,
  companyId: state.companyReducer.currentCompany._id,
  gettingCompanyDetails: state.companyReducer.gettingCompanyDetails,
  singleProjectLoading: state.projectReducer.singleProjectLoading,
  projectId: state.projectReducer.projectDetails._id,
  roomLoading: state.roomReducer.loading,
  currentRoom: state.roomReducer.currentRoom,
  currentProject: state.projectReducer.projectDetails,
  currentCompany: state.companyReducer.currentCompany,
});

export default connect(mapStateToProps, {
  getRooms,
  getRoomMessages,
  getRoomMembers,
  getRoomSharedFiles,
  getRoomDiscussions,
})(ProjectDiscussion);
