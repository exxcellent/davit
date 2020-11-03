import {render} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {Davit} from './Davit';
import {store} from './store';

test('renders learn react link', () => {
  const {getByText} = render(
      <Provider store={store}>
        <Davit />
      </Provider>,
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
