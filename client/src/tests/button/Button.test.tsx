import ReactDOM from 'react-dom';

import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';

import { TestButton } from 'components/form-components/styles/StyledButton';

afterEach(cleanup);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TestButton label={`A New Button`} />, div);
});

it('renders correctly', () => {
  const { getByTestId } = render(
    <TestButton label={`A New Button`} />,
  );

  expect(getByTestId('styled-button')).toHaveTextContent(
    'A New Button',
  );
});

it('matches snapshot', () => {
  const tree = renderer
    .create(<TestButton label={`A New Button`} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
