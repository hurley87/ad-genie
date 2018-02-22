import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem, Button } from 'react-bootstrap';

import './AuthenticatedNavigation.scss';

const AuthenticatedNavigation = ({ name, history }) => (
  <Nav className='AuthenticatedNavigation' pullRight>	      
    <NavDropdown key={2} title={name} id="user-nav-dropdown">
      <MenuItem key={2.0} onClick={() => history.push('/ads')}>Ads</MenuItem>
      <MenuItem key={2.1} onClick={() => history.push('/settings')}>Settings</MenuItem>
      <MenuItem key={2.2} onClick={() => history.push('/logout')}>Logout</MenuItem>
    </NavDropdown>
    <Button className='btn' href="/ads/new">Create Ad</Button>
  </Nav>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(AuthenticatedNavigation);
