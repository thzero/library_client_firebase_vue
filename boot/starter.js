import starter from '@thzero/library_client_firebase/boot/starter';

// export default async ({
export default ({
	router
}) => {
	return starter(() => {
		router.beforeResolve(async (to, from, next) => {
			const correlationId = LibraryCommonUtility.correlationId();
			serviceLogger.debug('middleware', 'router.beforeResolve', null, to, correlationId);
			if (!to.matched.some(record => record.meta.requiresAuth)) {
				next();
				return;
			}

			const record = to.matched.find(record => record.meta.requiresAuth);
			let requiresAuthRoles = [];
			let requiresAuthLogical = null;
			console.log('authorization.record', record);
			if (record && record.meta) {
				console.log('authorization.record.meta', record.meta);
				requiresAuthRoles = (record.meta.requiresAuthRoles && Array.isArray(record.meta.requiresAuthRoles)) ? record.meta.requiresAuthRoles : [];
				serviceLogger.info2('authorization.roles', requiresAuthRoles);
				console.log('authorization.roles', requiresAuthRoles);
				requiresAuthLogical = (record.meta.requiresAuthRoles && Array.isArray(record.meta.requiresAuthLogical)) ? record.meta.requiresAuthLogical : null;
				serviceLogger.info2('authorization.logical', requiresAuthLogical);
				console.log('authorization.logical', requiresAuthLogical);
			}

			const serviceAuth = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_AUTH);
			const result = await serviceAuth.resolveAuthorization(correlationId, requiresAuthRoles, requiresAuthLogical);
			serviceLogger.info2('authorization.result', result);
			console.log('authorization.result', result);
			if (!result) {
				LibraryClientUtility.$navRouter.push('/', null, () => {
					// LibraryClientUtility.$navRouter.push('/')
					// window.location.href = '/'
				});
				return;
			}

			serviceLogger.info2('authorization - success');
			console.log('authorization - success');
			next();
		});
	});
}
