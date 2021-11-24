import { Popover } from '@blueprintjs/core';
import { ITaskLabel } from 'stores/task/Reducer'
import { LabelListViewContainer, LabelListColumnViewContainer } from './TaskLabel.styles';

interface ILabelListViewProps {
  labels: ITaskLabel[];
}

const LabelListView = (props: ILabelListViewProps) => {
  const { labels } = props;
  return (
    <LabelListViewContainer>
      {labels &&
        labels.length > 0 ? (
        labels.slice(0, 2).map((label) => (
          <span className='bp3-tag'
            style={{ backgroundColor: label.color }}
            key={label._id}>
            {label.name}
          </span>)
        )
      ) : (
        'None'
      )
      }

      {labels && labels.length > 2 &&
        <Popover
          interactionKind='hover'
          canEscapeKeyClose={true}
          position='top'
          content={
            <LabelListColumnViewContainer>
              {labels.map((label) => (
                <span className='bp3-tag'
                  style={{ backgroundColor: label.color }}
                  key={label._id}>
                  {label.name}
                </span>)
              )}
            </LabelListColumnViewContainer>
          }
          target={<span className="bp3-tag"> + {labels.length - 2}</span>} />
      }
    </LabelListViewContainer>
  )
}

export default LabelListView
