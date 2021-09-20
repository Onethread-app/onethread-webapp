import { FieldRenderProps } from 'react-final-form';
import styled from 'styled-components';

import { checkError } from 'components/final-form/utils';

import StyledError from './StyledError';

type Props = FieldRenderProps<string>;

const SelectInput = styled.select``;

const StyledSelectInput = ({ input, meta, ...rest }: Props) => (
  <>
    <SelectInput {...input} {...rest} />
    {checkError(meta) ? (
      <StyledError errorMessage={meta.error || meta.submitError} />
    ) : null}
  </>
);

export default StyledSelectInput;
