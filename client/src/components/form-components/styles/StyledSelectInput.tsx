import { FieldRenderProps } from 'react-final-form';
import styled from 'styled-components';

import { checkError } from 'components/final-form/utils';

type Props = FieldRenderProps<string>;

const SelectInput = styled.select`
  border: ${({ hasError }) =>
    hasError ? '1px solid red' : '1px solid black'};
`;

const StyledSelectInput = ({ input, meta, ...rest }: Props) => (
  <>
    <SelectInput {...input} {...rest} hasError={checkError(meta)} />
  </>
);

export default StyledSelectInput;
