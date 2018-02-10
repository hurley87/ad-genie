import React from 'react';
import { Button } from 'react-bootstrap';

import './Index.scss';

const Index = () => (
  <div className="Index">
    <div className="contentWrapper">
    <img
      src="https://s3.us-east-2.amazonaws.com/snapmortgages/cool.jpg"
      alt="Clever Beagle"
    />
      <h3>Prospecting is tedious, and inefficient.</h3>
      <p>We find your prospects, and drive qualified interest right to your inbox.<br/>You step in to close the deal.</p>
      <div>
        <Button href="/signup">Get Started</Button>
      </div>
    </div>
  </div>
);

export default Index;
