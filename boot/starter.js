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
				console.log("authorization.isLoggedInA", isLoggedIn);
				console.log("authorization.isLoggedInA", isLoggedIn);
				console.log("authorization.isLoggedInA", isLoggedIn);
				console.log("authorization.isLoggedInA", isLoggedIn);
				if (!isLoggedIn) {
					// Briefly wait for authentication to settle...
					await sleep(150);
					const isLoggedIn2 = serviceAuth.isAuthenticated;
					console.log("authorization.isLoggedIn2", isLoggedIn2);
					console.log("authorization.isLoggedIn2", isLoggedIn2);
					console.log("authorization.isLoggedIn2", isLoggedIn2);
					console.log("authorization.isLoggedIn2", isLoggedIn2);
					isLoggedIn = isLoggedIn2;
				}
				console.log("authorization.isLoggedInB", isLoggedIn);
				console.log("authorization.isLoggedInB", isLoggedIn);
				console.log("authorization.isLoggedInB", isLoggedIn);
				console.log("authorization.isLoggedInB", isLoggedIn);
				if (!isLoggedIn) {
					console.log("authorization.isLoggedInB - failed");
					console.log("authorization.isLoggedInB - failed");
					console.log("authorization.isLoggedInB - failed");
					console.log("authorization.isLoggedInB - failed");
					console.log("authorization.isLoggedInB - failed");
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
				console.log("authorization.record", record);
				console.log("authorization.record", record);
				if (record && record.meta) {
					console.log("authorization.record.meta", record.meta);
					console.log("authorization.record.meta", record.meta);
					const roles = (record.meta.requiresAuthRoles && Array.isArray(record.meta.requiresAuthRoles)) ? record.meta.requiresAuthRoles : [];
					console.log("authorization.roles", roles);
					console.log("authorization.roles", roles);
					console.log("authorization.roles", roles);
					console.log("authorization.roles", roles);
					console.log("authorization.roles", roles);
					success = await serviceSecurity.authorizationCheckRoles(correlationId, user, roles, record.meta.requiresAuthLogical);
					console.log("authorization.success", success);
					console.log("authorization.success", success);
					console.log("authorization.success", success);
					console.log("authorization.success", success);
					console.log("authorization.success", success);
				}

				serviceLogger.debug('middleware', 'authorization', 'success', null, success, correlationId);
				console.log("authorization.success", success);
				console.log("authorization.success", success);
				console.log("authorization.success", success);
				console.log("authorization.success", success);
				if (!success) {
					console.log("authorization.isLoggedInC - failed role");
					console.log("authorization.isLoggedInC - failed role");
					console.log("authorization.isLoggedInC - failed role");
					console.log("authorization.isLoggedInC - failed role");
					console.log("authorization.isLoggedInC - failed role");
					LibraryClientUtility.$navRouter.push('/', null, () => {
						// LibraryClientUtility.$navRouter.push('/')
						// window.location.href = '/'
					});
					return;
				}

				console.log("authorization.isLoggedInC - success");
				console.log("authorization.isLoggedInC - success");
				console.log("authorization.isLoggedInC - success");
				console.log("authorization.isLoggedInC - success");
				console.log("authorization.isLoggedInC - success");
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
