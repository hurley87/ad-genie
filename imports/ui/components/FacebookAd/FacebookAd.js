import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import nl2br from 'react-nl2br';

import './FacebookAd.scss';

const FacebookAd = props => (
  <div className='facebook-desktop-card'>
    <div className='header clearfix overlay-container'>
      <img className='avatar pull-left' src={props.img}/>
      <div className='text pull-left'>
        <h3>{props.pageId.label}</h3>
        <span>
          Sponsored&nbsp;<i className="fa fa-globe" aria-hidden="true"></i>
        </span>
      </div>
      <div onClick={() => props.viewChange('pageId')} className='overlay'>
        <div className='overlay-text'>Change Page</div>
      </div>
    </div>
    <div className='body'>
      <div className='overlay-container'>
        <p className='card-text'>{props.description}</p>
        <div onClick={() => props.viewChange('description')} className='overlay'>
          <div className='overlay-text'>Change Description</div>
        </div>
      </div>
      <div className='video text-center overlay-container'>
        <video width="476" height="246" controls>
          <source src={props.vidUrl} type="video/mp4"/>
        </video>
        <div onClick={() => props.viewChange('video')} className='overlay'>
          <div className='overlay-text'>Change Video</div>
        </div>
      </div>
      <div className='text clearfix overlay-container'>
        <h3 className='pull-left'>{props.address}</h3>
        <div className='cta pull-right'>Send Message</div>
        <div onClick={() => props.viewChange('address')} className='overlay'>
          <div className='overlay-text'>Change Address</div>
        </div>
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
