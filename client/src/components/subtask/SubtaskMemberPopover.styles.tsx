import styled from 'styled-components';

export const Member = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  font-size: 12px;
  line-height: 18px;
  color: #323030;
  cursor: pointer;
`
export const MembersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-y: auto;
  max-height: 300px;
  gap: .5rem;
`

export const SubtaskMemberPopoverDiv = styled.div`
  min-width: 195px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .75rem;
`