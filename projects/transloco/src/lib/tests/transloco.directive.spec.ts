import { fakeAsync } from '@angular/core/testing';
import { TranslocoDirective, TranslocoParamsPipe, TranslocoService } from '../../public-api';
import { createHostComponentFactory, HostComponent, SpectatorWithHost } from '@netbasal/spectator';
import { providersMock, runLoader, setRuntime } from './transloco.mocks';

describe('TranslocoDirective', () => {
  let host: SpectatorWithHost<TranslocoDirective>;
  const createHost = createHostComponentFactory({
    component: TranslocoDirective,
    declarations: [TranslocoParamsPipe],
    providers: providersMock
  });

  function testScopedTranslation(host: SpectatorWithHost<TranslocoDirective, HostComponent>) {
    const service = host.get<TranslocoService>(TranslocoService);
    setRuntime(service);
    host.detectChanges();
    runLoader();
    // fakeAsync doesn't trigger CD
    host.detectChanges();
    expect(host.queryHost('div')).toHaveText('Admin Lazy english');
    service.setActiveLang('es');
    runLoader();
    host.detectChanges();
    expect(host.queryHost('div')).toHaveText('Admin Lazy spanish');
  }

  it('should unsubscribe after one emit when not in runtime mode', fakeAsync(() => {
    host = createHost(`<div transloco="home"></div>`);
    runLoader();
    expect(host.queryHost('[transloco]')).toHaveText('home english');
    host.get<TranslocoService>(TranslocoService).setActiveLang('es');
    host.detectChanges();
    runLoader();
    expect(host.queryHost('[transloco]')).toHaveText('home english');
  }));

  describe('Basic directive', () => {
    it('should set the translation value inside the element', fakeAsync(() => {
      host = createHost(`<div transloco="home"></div>`);
      runLoader();
      expect(host.queryHost('[transloco]')).toHaveText('home english');
    }));

    it('should support params', fakeAsync(() => {
      host = createHost(`<div transloco="alert" [translocoParams]="{ value: 'netanel' }"></div>`);
      runLoader();
      expect(host.queryHost('[transloco]')).toHaveText('alert netanel english');
    }));

    it('should support dynamic key', fakeAsync(() => {
      host = createHost(`<div [transloco]="key"></div>`, true, {
        key: 'home'
      });
      runLoader();
      expect(host.queryHost('div')).toHaveText('home english');
      host.component.key = 'fromList';
      host.detectChanges();
      expect(host.queryHost('div')).toHaveText('from list');
    }));

    it('should support dynamic params', fakeAsync(() => {
      host = createHost(`<div transloco="alert" [translocoParams]="{ value: dynamic }"></div>`, true, {
        dynamic: 'netanel'
      } as any);
      runLoader();
      expect(host.queryHost('[transloco]')).toHaveText('alert netanel english');
      (host.component as any).dynamic = 'kazaz';
      host.detectChanges();
      expect(host.queryHost('[transloco]')).toHaveText('alert kazaz english');
    }));

    it('should load scoped translation', fakeAsync(() => {
      host = createHost(`<div transloco="title" translocoScope="lazy-page"></div>`, false);
      testScopedTranslation(host);
    }));
  });

  describe('Structural directive', () => {
    it('should load scoped translation', fakeAsync(() => {
      host = createHost(`<section *transloco="let t; scope: 'lazy-page'"><div>{{t.title}}</div></section>`, false);
      testScopedTranslation(host);
    }));

    it('should create embedded view once', fakeAsync(() => {
      spyOn(TranslocoDirective.prototype as any, 'hasLoadingTpl').and.callThrough();
      host = createHost(`<section *transloco="let t"></section>`, false);
      const service = host.get<TranslocoService>(TranslocoService);
      setRuntime(service);
      host.detectChanges();
      runLoader();
      service.setActiveLang('es');
      runLoader();
      expect((TranslocoDirective.prototype as any).hasLoadingTpl).toHaveBeenCalledTimes(2);
    }));

    it('should set the translation value', fakeAsync(() => {
      host = createHost(`
        <section *transloco="let t">
           <div>{{t.home}}</div>
           <span>{{t.fromList}}</span>
           <p>{{t.a.b.c | translocoParams}}</p>
           <p>{{t.a.b.c | translocoParams:{fromList: "value"} }}</p>
        </section>
     `);
      runLoader();
      // fakeAsync doesn't trigger CD
      host.detectChanges();
      expect(host.queryHost('div')).toHaveText('home english');
      expect(host.queryHost('span')).toHaveText('from list');
      expect(host.queryHost('p')).toHaveText('a.b.c from list english');
      expect(host.queryHostAll('p')[1]).toHaveText('a.b.c value english');
    }));
  });
});
