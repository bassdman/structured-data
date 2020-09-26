import deepmerge from 'deepmerge';

import { SyncWaterfallHook, SyncHook, SyncBreakableHook } from '../libs/hooks.js';


function getType(target, property, value) {
    if (!target[property])
        return 'add';
    else if (value != null)
        return 'change'
    else
        return 'delete';
}

function initContext(target, property, value) {
    const type = getType(target, property, value);
    const ctx = {
        type,
        target: deepmerge(target, {}),
        property,
    }

    switch (type) {
        case 'change':
            ctx.oldValue = target[property];
            ctx.newValue = value;
            break;
        case 'delete':
            ctx.oldValue = target[property];
            break;
        case 'add':
            ctx.newValue = value;
    }

    return ctx;
}

function getRootKey(target, current) {
    if (target)
        return target + '.' + current;
    else
        return current;
}


function DataStorePlugin(config) {
    return {
        name: 'DataStorePlugin',
        addHooks: {
            changeContext: new SyncWaterfallHook(),
            prechange: new SyncBreakableHook(),
            change: new SyncHook(),
            postChange: new SyncHook()
        },
        hooks: {
            initPlugin: async function(config, ctx) {
                let data;
                if (!config.data) {
                    data = {};
                } else if (config.data.then) {
                    data = await config.data;
                } else if (typeof config.data == 'object' && !Array.isArray(config.data)) {
                    data = config.data;
                } else if (typeof config.data == 'function') {
                    data = await config.data(config, ctx);
                } else {
                    throw 'Error: config.data can not be resolved, it should be undefined, a promise, an object or a function that returns an object - but it is none of these.';
                }

                ctx.data = proxiedData(ctx, data);
            }
        },
        init: function(ctx) {
            ctx.data = proxiedData(ctx);
            return ctx;
        }
    }
}

function proxiedData(ctx, initialData = {}) {
    const proxyConfig = {
        set(target, key, value) {
            const proxiedValue = value;

            const initialContext = initContext(target, key, value);
            const context = ctx.hooks.changeContext.call(initialContext);

            const stopChange = ctx.hooks.prechange.call(context);

            if (stopChange)
                return true;

            target[key] = proxiedValue;

            context.target = target;
            ctx.hooks.change.call(context);
            return true;
        },
        get(target, key) {
            let value = target[key]
            if (value !== undefined && key !== '__rootTarget') {
                if (typeof value === 'object') {
                    value.__rootKey = getRootKey(target.__rootKey, key);

                    return new Proxy(value, proxyConfig)
                }
                return value;
            }
            return new Proxy({}, proxyConfig)
        },
        deleteProperty: function(target, key) {
            const initialContext = initContext(target, key, null);
            const context = ctx.hooks.changeContext.call(initialContext);

            const stopChange = ctx.hooks.prechange.call(context);

            if (stopChange)
                return true;

            delete target[key];
            return true;
        },
    };

    const data = new Proxy(initialData, proxyConfig);
    return data;
}

export { DataStorePlugin }