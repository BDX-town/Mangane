'use strict';

const element = document.getElementById('initial-state');
const initialState = element ? JSON.parse(element.textContent) : {};

export default initialState;
