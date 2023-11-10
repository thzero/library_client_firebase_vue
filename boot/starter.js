import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import starter from '@thzero/library_client_firebase/boot/starter';

// export default async ({
export default async ({router}) => {
	const serviceLogger = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_LOGGER);

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
        // console.log('authorization.record', record);
        serviceLogger.debug('starter', 'beforeResolve', 'authorization.record', record, correlationId);
        if (record && record.meta) {
            // console.log('authorization.record.meta', record.meta);
			serviceLogger.debug('starter', 'beforeResolve', 'authorization.record.meta', record.meta, correlationId);
            requiresAuthRoles = (record.meta.requiresAuthRoles && Array.isArray(record.meta.requiresAuthRoles)) ? record.meta.requiresAuthRoles : [];
            // console.log('authorization.roles', requiresAuthRoles);
			serviceLogger.debug('starter', 'beforeResolve', 'authorization.roles', requiresAuthRoles, correlationId);
            requiresAuthLogical = (record.meta.requiresAuthRoles && Array.isArray(record.meta.requiresAuthLogical)) ? record.meta.requiresAuthLogical : null;
            // console.log('authorization.logical', requiresAuthLogical);
			serviceLogger.debug('starter', 'beforeResolve', 'authorization.logical', requiresAuthLogical, correlationId);
        }

        const serviceAuth = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_AUTH);
        const result = await serviceAuth.resolveAuthorization(correlationId, requiresAuthRoles, requiresAuthLogical);
        // console.log('authorization.result', result);
        serviceLogger.debug('starter', 'beforeResolve', 'authorization.result', result, correlationId);
        if (!result) {
            LibraryClientUtility.$navRouter.push('/', null, () => {
                // LibraryClientUtility.$navRouter.push('/')
                // window.location.href = '/'
            });
            return;
        }

        serviceLogger.info2('authorization - success');
        // console.log('authorization - success');
        next();
    });

	return await starter(router);
}
