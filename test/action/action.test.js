import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import request from '../__mocks__/request'
jest.mock('../__mocks__/request');
const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares)

// You would import the action from your codebase in a real scenario
function success(data) {
  return {
    type: 'FAVORITE_LOAD_SUCCESS',
    projectModels: data
  }
}

function fetchData () {
  return dispatch => {
    return request() // Some async action with promise
      .then((data) => dispatch(success(data)))
  };
}

it('should execute fetch data', () => {
  const store = mockStore({})

  // Return the promise
  return store.dispatch(fetchData())
    .then(() => {
      const actions = store.getActions()
      expect(actions[0]).toMatchSnapshot()
    })
})
