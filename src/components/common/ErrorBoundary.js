import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Aaaaand we have an error");
    console.log({error, errorInfo});
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={'alert alert-warning'} role={'alert'}>
          <h4>Well, that was unexpected!</h4>
          <p>
            Check the console for error details.
          </p>
          <button type={'button'}
                  className={'btn btn-outline-dark'}
                  onClick={() => this.setState({hasError: false})}>
            Try again?
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;