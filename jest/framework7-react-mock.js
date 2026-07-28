/**
 * Jest mock for framework7-react (ESM-only package).
 * Provides passthrough React components for test rendering.
 */
'use strict';

const React = require('react');

const createMockComponent = (name) => {
  const Component = ({ children, className, ...props }) =>
    React.createElement('div', { 'data-f7-component': name, className }, children);
  Component.displayName = `F7.${name}`;
  return Component;
};

module.exports = {
  App: createMockComponent('App'),
  View: createMockComponent('View'),
  Panel: createMockComponent('Panel'),
  Toolbar: createMockComponent('Toolbar'),
  Link: createMockComponent('Link'),
  List: createMockComponent('List'),
  ListItem: createMockComponent('ListItem'),
  Page: createMockComponent('Page'),
  Navbar: createMockComponent('Navbar'),
  Block: createMockComponent('Block'),
};
