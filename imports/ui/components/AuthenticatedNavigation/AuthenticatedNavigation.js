import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import './AuthenticatedNavigation.scss';

const AuthenticatedNavigation = ({ name, history }) => (
  <div>
    <Nav>
    </Nav>
    <Nav pullRight>
      <LinkContainer to="/properties">
        <NavItem eventKey={1} href="/proporties">Properties</NavItem>
      </LinkContainer>
      <NavDropdown eventKey={2} title={name} id="user-nav-dropdown">
  {
         // <LinkContainer to="/profile">
         //    <NavItem eventKey={2.1} href="/profile">Profile</NavItem>
         //  </LinkContainer>

    }
        <MenuItem divider />
        <MenuItem eventKey={2.2} onClick={() => history.push('/logout')}>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(AuthenticatedNavigation);
