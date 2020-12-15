import { by, element, expect, device } from 'detox';

describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show home screen', async () => {
    await expect(element(by.id('home'))).toBeVisible();
  });

  it('should show search screen after tap', async () => {
    await element(by.id('searchButton')).tap();
    await expect(element(by.id('searchSreen'))).toBeVisible();
  });

  it('should come back to home after tapping back button on search screen', async () => {
    await element(by.id('back')).tap();
    await expect(element(by.text('HomeScreen'))).toBeVisible();
  });
});
