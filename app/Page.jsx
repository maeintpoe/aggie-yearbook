const React = require('react');
const Header = require('./Header');
const Content = require('./Content');
const Footer = require('./Footer');
const Input = require('./Input');

/* the main page for the index route of this app */
const Page = function() {
  return (
    <div>
      <Header/>
      <Content/>
      <Footer/>
    </div>
  );
}

module.exports = Page;