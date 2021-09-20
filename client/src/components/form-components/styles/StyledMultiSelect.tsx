import { FieldRenderProps } from 'react-final-form';
import styled from 'styled-components';

import { checkError } from 'components/final-form/utils';

import StyledError from './StyledError';

type Props = FieldRenderProps<string[]>;

const MultipleSelect = styled.select`
  border-radius: 0.5rem;
  text-indent: 10px;
  width: 100%;
`;

const StyledMultipleSelect = ({
  input: { value = [], ...input },
  meta,
  ...rest
}: Props) => {
  return (
    <>
      <MultipleSelect
        multiple
        value={value || []}
        {...input}
        {...rest}
      />
      {checkError(meta) ? (
        <StyledError errorMessage={meta.error || meta.submitError} />
      ) : null}
    </>
  );
};

export default StyledMultipleSelect;
