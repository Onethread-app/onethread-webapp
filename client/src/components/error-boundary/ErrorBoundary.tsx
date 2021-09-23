import { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import {
  ErrorImageOverlay,
  ErrorImageContainer,
  ErrorImageText,
} from './ErrorBoundary.styles';

interface Props {
  children: ReactNode;
}

interface State {
  hasErrored: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // eslint-disable-next-line react/state-in-constructor
  public state: State = {
    hasErrored: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasErrored: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasErrored) {
      return (
        <ErrorImageOverlay>
          <ErrorImageContainer imageUrl='https://i.imgur.com/qIufhof.png' />
          <ErrorImageText>
            Sorry, this page is broken.
            {' '}
            <br />
            <Link to='/'>Back To Home</Link>
          </ErrorImageText>
        </ErrorImageOverlay>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
