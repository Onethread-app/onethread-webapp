import styled from 'styled-components';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import { Color } from 'stores/UtilsActions';

export const SelectColorContainer = styled.div`
  display: flex;
`;

interface ISelectColorProps {
  labelColor: string;
  setLabelColor: (color: string) => void;
}

const SelectColor = (props: ISelectColorProps) => {
  const { labelColor } = props;

  return (
    <SelectColorContainer>
      {Color.map((color) => (
        <div className="pr2" key={color.code}>
          <Icon
            className="br2 flex items-center justify-center h-100"
            icon={color.value === labelColor ? 'tick' : 'blank'}
            iconSize={16}
            onClick={(e) => {
              e.preventDefault();
              props.setLabelColor(color.value);
            }}
            style={{
              backgroundColor: color.value,
              border:
                color.value === labelColor
                  ? '1px solid #ffffff'
                  : '1px solid transparent',
              height: '27px',
              width: '27px',
              borderRadius: '50%',
            }}
          />
        </div>
      ))}
    </SelectColorContainer>
  );
};

export default SelectColor;
