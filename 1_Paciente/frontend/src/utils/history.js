
import createHistory from 'history/createBrowserHistory'
const history = createHistory()
history.pushLater = (...args) => setImmediate(() => history.push(...args))
export default history