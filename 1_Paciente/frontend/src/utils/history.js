import { createBrowserHistory as createHistory } from 'history';
const history = createHistory();
history.pushLater = (...args) => setImmediate(() => history.push(...args));
export default history;

/*Warning: Please use `require("history").createBrowserHistory` instead of 
`require("history/createBrowserHistory")`. 
Support for the latter will be removed in the next major release. */
