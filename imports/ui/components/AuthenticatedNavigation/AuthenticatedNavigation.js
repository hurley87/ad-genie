import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import './AuthenticatedNavigation.scss';

const AuthenticatedNavigation = ({ name, history }) => (
  <Nav pullRight>
  	<MenuItem eventKey={1} onClick={() => history.push('/ads')}>Ads</MenuItem>
    <NavDropdown eventKey={2} title='Dave' id="user-nav-dropdown">
      <MenuItem eventKey={2.1} onClick={() => history.push('/settings')}>Settings</MenuItem>
      <MenuItem eventKey={2.2} onClick={() => history.push('/logout')}>Logout</MenuItem>
    </NavDropdown>
  </Nav>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(AuthenticatedNavigation);
