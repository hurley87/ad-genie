import React from 'react';

class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.calculateFill = this.calculateFill.bind(this);
  }

  calculateFill() {
    const { width } = this.props;
    return `%`;
  }

  render() {
    return (<div className="Progress">
      <div className="progress-bar">
        <div className="fill" style={{ width: this.calculateFill() }}></div>
      </div>
    </div>);
  }
}

Progress.propTypes = {
};

export default Progress;