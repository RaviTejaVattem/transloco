import { fakeAsync, tick } from '@angular/core/testing';
import {TranslocoDirective, DefaultParser} from '../../public-api';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import {providersMock} from "./transloco.mocks";

describe('TranslocoParser', () => {

  const parser = new DefaultParser();

  it('should translate simple string from params', () => {
    const parsed = parser.parse('Hello {{ value }}', { value: 'World' }, {});
    expect(parsed).toEqual('Hello World');
  });

  it('should translate simple string with multiple params', () => {
    const parsed = parser.parse('Hello {{ from }} {{ name }}', { name: 'Transloco', from: 'from' }, {});
    expect(parsed).toEqual('Hello from Transloco');
  });

  it('should translate simple string with a key from lang', () => {
    const parsed = parser.parse('Hello {{ world }}', {}, { world: 'World' });
    expect(parsed).toEqual('Hello World');
  });

  it('should translate simple string multiple keys from lang', () => {
    const lang = { withKeys: 'with keys', from: 'from', lang: 'lang' };
    const parsed = parser.parse('Hello {{ withKeys }} {{ from }} {{ lang }}', {}, lang);
    expect(parsed).toEqual('Hello with keys from lang');
  });

  it('should translate simple string with params and from lang', () => {
    const parsed = parser.parse('Hello {{ from }} {{ name }}', {name: 'Transloco'}, { from: 'from' });
    expect(parsed).toEqual('Hello from Transloco');
  });


});
