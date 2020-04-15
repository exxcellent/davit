import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Carv2 } from './Carv2';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Carv2 />
    </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
