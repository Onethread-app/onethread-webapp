import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0 0;
  margin: 0 auto;
  min-height: 52px;

  img {
    max-width: 100px;
  }

  hr {
    margin-top: 0.75rem;
    width: 100%;
    opacity: 0.2;
    border-bottom: 1px solid #ffffff;
  }
`;

const ContainerBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 var(--padding);
  row-gap: 0.25rem;
`;

const Item = styled(Link)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: var(--item-padding);
  color: var(--secondary-color);
  border: 1px solid transparent;

  &:hover {
    border: 1px dashed var(--secondary-color);
    opacity: 0.7;
    border-radius: 8px;
    color: var(--secondary-color);
  }

  img {
    padding: 0 0.5rem 0 0;
  }
`;

const Favourites = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  color: var(--secondary-color);
  padding: 0.5rem 1rem;

  img {
    margin-right: 8px;
  }

  div {
    margin-top: 1rem;
    padding: 1rem;
    background: #373760;
    border-radius: 8px;
    /* width: 180px; */
    /* height: 64px; */
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const ArrayItem = styled(NavLink)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 12px 14px 11px;
  color: var(--secondary-color);
  border: 1px solid transparent;

  &:hover {
    border: 1px dashed var(--secondary-color);
    opacity: 0.7;
    border-radius: 8px;
    color: var(--secondary-color);
  }

  i {
    width: 8px;
    height: 8px;
    margin-right: 8px;
    background: ${(props) => props.bgcolor};
  }

  span {
    padding: 0 0.5rem 0 0;
    width: calc(100% - 20px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const CompanyContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const Container = styled.div`
  --padding: ${(props) => (props.leftOpen ? '1rem' : '0')};
  --item-padding: ${(props) =>
    props.leftOpen ? '12px 14px 11px' : '1rem 0'};
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;

  .active-link {
    background: #1f1f42;
    border-radius: 8px;
  }

  .left-open {
    display: ${(props: { leftOpen: boolean }) =>
      props.leftOpen ? 'flex' : 'none'};
  }

  img {
    padding: ${(props) => (!props.leftOpen ? '0' : '')};
  }

  ${Item} {
    justify-content: ${(props) =>
      props.leftOpen ? 'flex-start' : 'center'};
  }

  ${Header} {
    margin-left: ${(props) => (props.leftOpen ? 'auto' : '0.5rem')};
    margin-bottom: ${(props) => (props.leftOpen ? '0' : '0.5rem')};
  }

  .capitalize {
    text-transform: capitalize;
  }
`;

export {
  Container,
  Header,
  ContainerBody,
  Item,
  ArrayItem,
  Favourites,
  CompanyContainer,
};
