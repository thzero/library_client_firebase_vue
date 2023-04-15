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
			serviceLogger.debug('router.beforeResolve', to);
			if (to.matched.some(record => record.meta.requiresAuth)) {
				let isLoggedIn = serviceAuth.isAuthenticated;
				if (isLoggedIn) {
					// Briefly wait for authentication to settle...
					await sleep(150);
					const isLoggedIn2 = serviceAuth.isAuthenticated;
					isLoggedIn = isLoggedIn2;
				}
				if (!isLoggedIn) {
					// LibraryClientUtility.$EventBus.on('auth-refresh', (user) => {
					//	 serviceLogger.debug('auth-refresh', user)
					//	 next()
					// })
					// return
					LibraryClientUtility.$navRouter.push('/', null, () => {
						// LibraryClientUtility.$navRouter.push('/')
						// window.location.href = '/'
					});
					return;
				}

				const user = serviceStore.user;
				let success = true;
				const record = to.matched.find(record => record.meta.requiresAuth);
				if (record && record.meta) {
					const roles = (record.meta.requiresAuthRoles && Array.isArray(record.meta.requiresAuthRoles)) ? record.meta.requiresAuthRoles : [];
					success = await serviceSecurity.authorizationCheckRoles(correlationId, user, roles, record.meta.requiresAuthLogical);
				}

				serviceLogger.debug('middleware', 'authorization', 'success', null, success, correlationId);
				if (!success) {
					LibraryClientUtility.$navRouter.push('/', null, () => {
						// LibraryClientUtility.$navRouter.push('/')
						// window.location.href = '/'
					});
					return;
				}

				next();

				// eslint-disable-next-line no-unused-vars
				//	 auth.isAuthenticated().then(async (data) => {
				//		 serviceLogger.debug('router.beforeResolve.matched')

				//		 //const isLoggedIn = LibraryClientUtility.$store.state.user.isLoggedIn
				//		 const isLoggedIn = await auth.isAuthenticated()
				//		 if (!isLoggedIn) {
				//			 LibraryClientUtility.$EventBus.on('auth-refresh', (user) => {
				//				 serviceLogger.debug('auth-refresh', user)
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
