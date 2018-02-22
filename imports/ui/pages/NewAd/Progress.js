import React from 'react';
import './Progress.scss'
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
    return (
      <div className="progress">
        <div className="fill" style={{ width: this.props.width }}></div>
      </div>
    );
  }
}

Progress.propTypes = {
};

export default Progress;