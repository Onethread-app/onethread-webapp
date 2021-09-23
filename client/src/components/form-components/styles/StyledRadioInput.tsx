import { FieldRenderProps } from 'react-final-form';
import styled from 'styled-components';

import { checkError } from 'components/final-form/utils';

import StyledError from './StyledError';

type Props = FieldRenderProps<string>;

const RadioInput = styled.input`
  height: 47px;
  border-radius: 0.5rem;
  text-indent: 10px;
  width: fit-content;
`;

const StyledRadioInput = ({ input, meta, ...rest }: Props) => (
  <>
    <RadioInput {...input} {...rest} type='radio' />
    {checkError(meta) ? (
      <StyledError errorMessage={meta.error || meta.submitError} />
    ) : null}
  </>
);

export default StyledRadioInput;
