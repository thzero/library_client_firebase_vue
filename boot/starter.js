import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility/index';

import starter from '@thzero/library_client_firebase/boot/starter';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// export default async ({
export default ({
	router
}) => {
	return starter(() => {
		router.beforeResolve(async (to, from, next) => {
			const correlationId = LibraryCommonUtility.correlationId();
			const serviceAuth = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_AUTH);
			const serviceLogger = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_LOGGER);
			const serviceSecurity = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_SECURITY);
			const serviceStore = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_STORE);
			serviceLogger.debug('middleware', 'router.beforeResolve', null, to, correlationId);
			if (to.matched.some(record => record.meta.requiresAuth)) {
				serviceLogger.info2('requiresAuth');
				let isLoggedIn = serviceAuth.isAuthenticated;
				serviceLogger.info2('authorization.isLoggedIn', isLoggedIn);
				console.log('authorization.isLoggedIn', isLoggedIn);
				if (!isLoggedIn) {
					// Briefly wait for authentication to settle...
					let i = 0;
					while (await sleep(150)) {
						if (serviceStore.serviceStore.userAuthCompleted) {
							serviceLogger.info2('authorization.userAuthCompleted', userAuthCompleted);
							console.log('authorization.userAuthCompleted', userAuthCompleted);
							break;
						}
						i++;
						serviceLogger.info2('waiting... ' + i);
						if (i > 5) {
							serviceLogger.warn2('authorization.userAuthCompleted failed');
							break;
						}
					}
					const isLoggedInAuthCompleted = serviceAuth.isAuthenticated;
					serviceLogger.info2('authorization.isLoggedIn.userAuthCompleted', isLoggedInAuthCompleted);
					console.log('authorization.isLoggedIn.userAuthCompleted', isLoggedInAuthCompleted);
					isLoggedIn = isLoggedInAuthCompleted;
				}
				serviceLogger.info2('authorization.isLoggedIn.final', isLoggedIn);
				console.log('authorization.isLoggedIn.final', isLoggedIn);
				if (!isLoggedIn) {
					serviceLogger.warn2('authorization.isLoggedIn - failed');
					console.log('authorization.isLoggedIn - failed');
					// LibraryClientUtility.$EventBus.on('auth-refresh', (user) => {
					//	 serviceLogger.debug('auth-refresh', user)
					//	 serviceLogger.debug('middleware', 'auth-refresh', null, user, correlationId);
					//	 next()
					// })
					// return
					LibraryClientUtility.$navRouter.push('/', null, () => {
						// LibraryClientUtility.$navRouter.push('/')
						// window.location.href = '/'
					});
					return;
				}

				serviceLogger.info2('authorization.isLoggedIn - success');
				console.log('authorization.isLoggedIn - success');

				const user = serviceStore.user;
				let success = true;
				const record = to.matched.find(record => record.meta.requiresAuth);
				console.log('authorization.record', record);
				if (record && record.meta) {
					console.log('authorization.record.meta', record.meta);
					const roles = (record.meta.requiresAuthRoles && Array.isArray(record.meta.requiresAuthRoles)) ? record.meta.requiresAuthRoles : [];
					serviceLogger.info2('authorization.roles', roles);
					console.log('authorization.roles', roles);
					success = await serviceSecurity.authorizationCheckRoles(correlationId, user, roles, record.meta.requiresAuthLogical);
					console.log('authorization.roles.success', success);
				}

				serviceLogger.debug('middleware', 'authorization', 'success', success, correlationId);
				console.log('authorization.roles.success', success);
				serviceLogger.info2('authorization.roles.success', success);
				if (!success) {
					serviceLogger.warn2('authorization.roles - failed');
					console.log('authorization.roles - failed');
					LibraryClientUtility.$navRouter.push('/', null, () => {
						// LibraryClientUtility.$navRouter.push('/')
						// window.location.href = '/'
					});
					return;
				}

				serviceLogger.info2('authorization.roles - success');
				console.log('authorization.roles - success');
				next();

				// eslint-disable-next-line no-unused-vars
				//	 auth.isAuthenticated().then(async (data) => {
				//		 serviceLogger.debug('router.beforeResolve.matched')
				//	 	 serviceLogger.debug('middleware', 'router.beforeResolve.matched', null, null, correlationId);

				//		 //const isLoggedIn = LibraryClientUtility.$store.state.user.isLoggedIn
				//		 const isLoggedIn = await auth.isAuthenticated()
				//		 if (!isLoggedIn) {
				//			 LibraryClientUtility.$EventBus.on('auth-refresh', (user) => {
				//	 	 		 serviceLogger.debug('middleware', 'auth-refresh', null, user, correlationId);
				//				 next()
				//			 })
				//			 return
				//		 }

				//		 // if (LibraryClientUtility.$store.state.user.token) {
				//		 //	 next()
				//		 //	 return
				//		 // }

				//		 // LibraryClientUtility.$EventBus.on('auth-refresh', (user) => {
				//		 //	 serviceLogger.debug('auth-refresh', user)
				//	 	 //	 serviceLogger.debug('middleware', 'auth-refresh', null, user, correlationId);
				//		 //	 next()
				//		 // })

				//		 next()
				//	 }).catch((e) => {
				//		 serviceLogger.error('router.beforeResolve.error', e)
				//		 serviceLogger.error('to', to)
				//		 serviceLogger.error('from', from)
				//		 if (to.name == 'auth') {
				//			 next()
				//			 return
				//		 }
				//		 next({ path: '/auth' })
				//	 })

				return;
			}
			next();
		});
	});
};
