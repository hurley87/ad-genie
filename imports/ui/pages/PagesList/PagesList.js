import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Link } from 'react-router-dom';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import Audiences from '../../../api/Audiences/Audiences';
import _ from 'lodash';
import Select from 'react-select';

const PagesList = ({ loading, select, handlePageChange, currentRegion, match, history }) => (
  !loading ? 
    <div className="PagesList">
      <Select
        name="page"
        value={currentRegion.value}
        onChange={handlePageChange}
        options={select}
      />
    </div> : <Loading />
);

PagesList.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object
};

export default createContainer((props) => {
	const user = Meteor.users.findOne(Meteor.userId())
	let pages = user.profile.pages;
	let select = [];
	for(let page in pages) {
		select.push({
			value: pages[page].id,
			label: pages[page].name
		})
	}

  select.push({ value: "194104847836394", label: "Property Messenger", img: "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/26804369_194105004503045_2459918275830932498_n.jpg?oh=b8241812e0b5e568b8defe52fa35fd39&oe=5B04BDBC" })
 
  return {
    loading: false,
    select: select,
    handlePageChange: props.handlePageChange,
    currentRegion: props.currentPage
  };
}, PagesList);
