import { FieldRenderProps } from 'react-final-form';
import styled from 'styled-components';

import { checkError } from 'components/final-form/utils';

import StyledError from './StyledError';

type Props = FieldRenderProps<string>;

export const TextInput = styled.input`
  height: 47px;
  border-radius: 0.5rem;
  text-indent: 10px;
  width: 100%;
  border: 1px solid #c9c9c9;
  vertical-align: middle;
`;

const StyledTextInput = ({ input, meta, ...rest }: Props) => {
  return (
    <>
      <TextInput type="text" {...input} {...rest} />
      {checkError(meta) ? (
        <StyledError errorMessage={meta.error || meta.submitError} />
      ) : null}
    </>
  );
};

export default StyledTextInput;
