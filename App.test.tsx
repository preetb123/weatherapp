import React from 'react';
import { render } from '@testing-library/react-native';
import { App } from './App';

it('render the app', () => {
  const element = render(<App />);
  expect(element).toBeTruthy();
});
