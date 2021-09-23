import { FieldRenderProps } from 'react-final-form';
import styled from 'styled-components';

import { checkError } from 'components/final-form/utils';

import StyledError from './StyledError';

type Props = FieldRenderProps<string>;

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const MultipleCheckBox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: ${(props: { checked: boolean }) => (props.checked ? 'salmon' : 'papayawhip')};
  border-radius: 3px;
  transition: all 150ms;
  margin-left: 10px;
  margin-right: 10px;

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px pink;
  }

  ${Icon} {
    visibility: ${(props: { checked: boolean }) => (props.checked ? 'visible' : 'hidden')};
  }
`;

const StyledMultipleCheckBox = ({
  input: { value, ...input },
  meta,
  ...rest
}: Props) => (
  <>
    <CheckboxContainer>
      <HiddenCheckbox
        type='checkbox'
        checked={input.checked}
        {...input}
        {...rest}
      />
      <MultipleCheckBox checked={input.checked}>
        <Icon viewBox='0 0 24 24'>
          <polyline points='20 6 9 17 4 12' />
        </Icon>
      </MultipleCheckBox>
    </CheckboxContainer>
    {checkError(meta) ? (
      <StyledError errorMessage={meta.error || meta.submitError} />
    ) : null}
  </>
);

export default StyledMultipleCheckBox;
