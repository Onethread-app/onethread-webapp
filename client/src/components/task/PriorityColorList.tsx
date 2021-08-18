import React from 'react';
import styled from 'styled-components';

import { priorityColor } from 'stores/UtilsActions';

const PriorityIcon = styled.span`
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: ${(props) => props.value};
  margin-right: 0.5rem;
  cursor: pointer;
`;

const PriorityColorList = () => {
  return (
    <div className="flex items-center mb2">
      <span className="mr2">Task Priority: </span>
      {priorityColor.map((priority) => (
        <PriorityIcon
          title={priority.name}
          value={priority.value}
          key={priority.code}
        />
      ))}
    </div>
  );
};

export default PriorityColorList;
