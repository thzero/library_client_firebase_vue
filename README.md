![GitHub package.json version](https://img.shields.io/github/package-json/v/thzero/library_client_firebase_vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# library_client_firebase_vue

Vue 3 integration for [library_client_firebase](https://github.com/thzero/library_client_firebase): a starter that initializes Firebase authentication and installs a [vue-router](https://router.vuejs.org) guard that enforces each route's authorization.

## Requirements

### NodeJs

[NodeJs](https://nodejs.org) version 22+.

## Installation

[![NPM](https://nodei.co/npm/@thzero/library_client_firebase_vue.png?compact=true)](https://npmjs.org/package/@thzero/library_client_firebase_vue)

```
npm install @thzero/library_client_firebase_vue
```

It installs `@thzero/library_client_firebase`, and requires `@thzero/library_client` and `@thzero/library_common` as peers. Set up Firebase and the configuration as described in [library_client_firebase](https://github.com/thzero/library_client_firebase#firebase-setup), and register its authentication service.

## Usage

Pass the starter to `start` in `main.js` (see [library_client_vue3](https://github.com/thzero/library_client_vue3)):

```js
import bootStarter from '@thzero/library_client_firebase_vue/boot/starter';

import start from '@thzero/library_client_vue3/boot/main';

start(App, router, store, [ /* boot files */ ], bootStarter, options);
```

### Protecting routes

The guard runs before every navigation. A route is protected only when its `meta` sets `requiresAuth: true`; a route without it is public.

```js
{
	path: '/settings',
	component: () => import('@/components/Settings.vue'),
	meta: {
		requiresAuth: true
	}
},
{
	path: '/admin',
	component: () => import('@/components/admin/Admin.vue'),
	meta: {
		requiresAuth: true,
		requiresAuthRoles: [ 'admin' ],
		requiresAuthLogical: 'or'
	}
}
```

* **`requiresAuth`**: the user must be signed in.
* **`requiresAuthRoles`**: optional; the user must also hold these roles.
* **`requiresAuthLogical`**: optional; `'or'` (any of the roles, the default) or `'and'` (all of them).

A user who fails the check is sent to `/`.

Typical public routes are home, about, open source, sign in and not found; typical protected ones are settings, support, admin, and any route that needs a signed-in user.

## Development

```
npm install
npm test
npm run lint
```

Tests use [Vitest](https://vitest.dev); the `test` folder and the configuration files are not published. Installing currently needs `npm install --force`, until `@thzero/library_client_firebase` is published with `@thzero/library_common ^0.19`.

## License

[MIT](license.md)
