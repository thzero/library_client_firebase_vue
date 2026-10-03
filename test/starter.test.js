import { beforeEach, describe, expect, it, vi } from 'vitest';

import LibraryClientConstants from '@thzero/library_client/constants';
import LibraryClientUtility from '@thzero/library_client/utility/index';

import starter from '../boot/starter';

describe('starter', () => {
	let auth;
	let guard;
	let router;

	beforeEach(async () => {
		auth = {
			initialize: vi.fn(async () => true),
			resolveAuthorization: vi.fn(async () => true)
		};
		const services = {
			[LibraryClientConstants.InjectorKeys.SERVICE_AUTH]: auth,
			[LibraryClientConstants.InjectorKeys.SERVICE_LOGGER]: { debug() {}, info2() {} }
		};
		LibraryClientUtility.$injector = { getService: (key) => services[key] };
		LibraryClientUtility.$navRouter = { push: vi.fn() };

		guard = null;
		router = { beforeResolve: (fn) => { guard = fn; } };

		await starter({ router });
	});

	it('initializes the auth service with the router', () => {
		// it called the base starter with the router itself, where { router } is expected
		expect(auth.initialize).toHaveBeenCalledWith(expect.any(String), router);
	});

	it('installs a route guard', () => {
		expect(guard).toBeTypeOf('function');
	});

	it('passes the required roles and the logical to the auth service', async () => {
		await guard({ matched: [ { meta: { requiresAuth: true, requiresAuthRoles: [ 'admin' ], requiresAuthLogical: 'and' } } ] }, {});

		// the logical is a string; testing it with Array.isArray turned every 'and' into null
		expect(auth.resolveAuthorization).toHaveBeenCalledWith(expect.any(String), [ 'admin' ], 'and');
	});

	it('passes no logical when the route declares none', async () => {
		await guard({ matched: [ { meta: { requiresAuth: true, requiresAuthRoles: [ 'admin' ] } } ] }, {});

		expect(auth.resolveAuthorization).toHaveBeenCalledWith(expect.any(String), [ 'admin' ], null);
	});

	it('skips routes that do not require auth', async () => {
		await guard({ matched: [ { meta: { requiresAuth: false } } ] }, {});

		expect(auth.resolveAuthorization).not.toHaveBeenCalled();
	});

	it('sends a refused navigation home', async () => {
		auth.resolveAuthorization.mockResolvedValue(false);

		await guard({ matched: [ { meta: { requiresAuth: true } } ] }, {});

		expect(LibraryClientUtility.$navRouter.push).toHaveBeenCalledWith('/', null, expect.any(Function));
	});
});
