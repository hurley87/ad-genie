import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import nl2br from 'react-nl2br';

import './FacebookAd.scss';

const FacebookAd = props => (
  <div className='facebook-desktop-card'>
    <div className='header clearfix'>
      <img className='avatar pull-left' src='/avatar.png'/>
      <div className='text pull-left'>
        <h3>{props.pageId.label}</h3>
        <span>
          Sponsored&nbsp;<i className="fa fa-globe" aria-hidden="true"></i>
        </span>
      </div>
    </div>
    <div className='body'>
      <p className='card-text'>{props.description}</p>
      <div className='video text-center'>
        <video width="476" height="246" controls>
          <source src={props.vidUrl} type="video/mp4"/>
        </video>
      </div>
      <div className='text clearfix'>
        <h3 className='pull-left'>{props.address}</h3>
        <div className='cta pull-right'>Send Message</div>
      </div>
    </div>
    <div className='footer'>
      <div className='button'>
        <img src='/fb_like.png'/>
        <span> Like</span>
      </div>
      <div className='button'>
        <img src='/fb_comment.png'/>
        <span> Comment</span>
      </div>
      <div className='button'>
        <img src='/fb_share.png'/>
        <span> Share</span>
      </div>
    </div>
  </div>
);

FacebookAd.defaultProps = {
  name: '',
};

FacebookAd.propTypes = {
  name: PropTypes.string,
};

export default FacebookAd;
