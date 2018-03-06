import React from 'react';
import { Grid, Col, Row } from 'react-flexbox-grid';
import { Switch, Route, Link } from 'react-router-dom';

import './Web3Unavailable.css';

const Web3InfoComponent = () => (
  <Row>
    <Col xs={12} md={8} mdOffset={2}>
      <h2>You're almost there!</h2>
      <p>
        Before you can start sending Red ETHvelopes, you'll need an Ethereum wallet with Ether funds to deposit into each Red ETHvelope you send.
      </p>
      <p>
        A good and secure wallet to use is <a href="https://metamask.io/">Metamask</a>, a browser extension for <a href="https://www.google.com/chrome/">Chrome</a> and/or <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>.
      </p>
      <br/>
      <p>
        <a 
          className="btn btn__md"
          href="https://metamask.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Metamask
        </a>
      </p>
      <br/>
      <p><Link to="/">Installed Metamask? Click here to get started.</Link></p>
    </Col>
  </Row>
);

const LoginComponent = () => (
  <Row>
    <Col xs={10} xsOffset={2} md={8} mdOffset={2}>
      <h2>Start sending Red ETHvelopes</h2>
      <p>
        Red ETHvelopes are new type of "Lai See", a cryptocollectible built on top of the Ethereum blockchain.
      </p>
      <p>
        It looks like you still need to install a few things before you can start sending Red Ethvelopes.
      </p>
      <br/>
      <Link className="btn btn__md" to="/login">Let's Get Started</Link>
    </Col>
  </Row>
);

export const Web3Unavailable = () => (
  <Grid className="Web3Unavailable">
    <Switch>
      <Route path="/login" component={Web3InfoComponent} />
      <Route component={LoginComponent} />
    </Switch>
  </Grid>
);

export const AccountUnavailable = () => (
  <div className="AccountUnavailable">
    <h1>Web 3 Unavailable</h1>
  </div>
);
