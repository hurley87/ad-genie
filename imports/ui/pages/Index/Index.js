import React from 'react';
import { Button } from 'react-bootstrap';

import './Index.scss';

const Index = () => (
  <div className="Index">
    <img
      src="https://s3.us-east-2.amazonaws.com/snapmortgages/cool.jpg"
      alt="Clever Beagle"
    />
    <p>A boilerplate for products.</p>
    <div>
      <Button href="/signup">Get Started</Button>
    </div>
  </div>
);

export default Index;
