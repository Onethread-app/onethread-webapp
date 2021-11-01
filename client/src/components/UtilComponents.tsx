import styled from 'styled-components';

export const AlignAndJustifyCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.gap || '0'};
`;

export const JustifyCenter = styled.div`
  display: flex;
  justify-content: center;
  gap: ${(props) => props.gap || '0'};
`;

export const AlignCenter = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.gap || '0'};
`;

export const Flex = styled.div`
  display: flex;
`;
