import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import starter from '@thzero/library_client_firebase/boot/starter';

// export default async ({
export default ({
	router
}) => {
	return starter(() => {
		router.beforeResolve((to, from, next) => {
			const auth = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_AUTH);
			const logger = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_LOGGER);
			logger.debug('router.beforeResolve', to);
			if (to.matched.some(record => record.meta.requiresAuth)) {
				const isLoggedIn = auth.isAuthenticated;
				if (!isLoggedIn) {
					// GlobalUtility.$EventBus.on('auth-refresh', (user) => {
					//	 logger.debug('auth-refresh', user)
					//	 next()
					// })
					// return
					GlobalUtility.$navRouter.push('/', null, () => {
						// GlobalUtility.$navRouter.push('/')
						// window.location.href = '/'
					});
					return;
				}
	
				next();
	
				// eslint-disable-next-line no-unused-vars
				//	 auth.isAuthenticated().then(async (data) => {
				//		 logger.debug('router.beforeResolve.matched')
	
				//		 //const isLoggedIn = GlobalUtility.$store.state.user.isLoggedIn
				//		 const isLoggedIn = await auth.isAuthenticated()
				//		 if (!isLoggedIn) {
				//			 GlobalUtility.$EventBus.on('auth-refresh', (user) => {
				//				 logger.debug('auth-refresh', user)
				//				 next()
				//			 })
				//			 return
				//		 }
	
				//		 // if (GlobalUtility.$store.state.user.token) {
				//		 //	 next()
				//		 //	 return
				//		 // }
	
				//		 // GlobalUtility.$EventBus.on('auth-refresh', (user) => {
				//		 //	 logger.debug('auth-refresh', user)
				//		 //	 next()
				//		 // })
	
				//		 next()
				//	 }).catch((e) => {
				//		 logger.error('router.beforeResolve.error', e)
				//		 logger.error('to', to)
				//		 logger.error('from', from)
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
