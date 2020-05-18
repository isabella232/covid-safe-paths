import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { NativeModules } from 'react-native';
import * as permissions from 'react-native-permissions';

// import { UnknownPage } from '../UnknownPage';

let settingsURLSpy;

beforeEach(() => {
  settingsURLSpy = jest
    .spyOn(permissions, 'openSettings')
    .mockImplementation(() => Promise.resolve());
});

afterEach(() => {
  settingsURLSpy.mockRestore();
});

describe('UnknowPage', () => {
  describe('when the tracing strategy is gps', () => {
    beforeEach(() => {
      NativeModules.COVIDSafePathsConfig = {
        getTracingStrategy: jest.fn(() => 'gps'),
      };
    });

    const { UnknownPage } = require('../UnknownPage');

    describe('and the permissions are unknown', () => {
      it('it matches the snapshot', () => {
        const { asJSON } = render(<UnknownPage />);

        expect(asJSON()).toMatchSnapshot();
      });

      it('the enable location button opens the settings screen', async () => {
        const { getByLabelText } = render(<UnknownPage />);

        const button = getByLabelText('Enable Location Data');
        fireEvent.press(button);

        expect(settingsURLSpy).toHaveBeenCalled();
      });
    });
  });

  describe('when the tracing strategy is bte', () => {
    beforeEach(() => {
      NativeModules.COVIDSafePathsConfig = {
        getTracingStrategy: jest.fn(() => 'bte'),
      };
    });

    const { UnknownPage } = require('../UnknownPage');

    it('the enable bluetooth button opens the settings screen', async () => {
      const { getByLabelText } = render(<UnknownPage />);

      const button = getByLabelText('Enable Bluetooth');
      fireEvent.press(button);

      expect(settingsURLSpy).toHaveBeenCalled();
    });
  });
});
