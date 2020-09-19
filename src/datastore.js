import deepmerge from 'deepmerge';

import pkg from 'tapable';
const { SyncBailHook, SyncHook, SyncWaterfallHook } = pkg;


const hooks = {
    changeContext: new SyncWaterfallHook(["context"]),
    prechange: new SyncBailHook(["context"]),
    change: new SyncHook(["context"]),
    postChange: new SyncHook(["context"])
};

const proxyConfig = {
    set(target, property, value) {
        const proxiedValue = value;

        const initialContext = initContext(target, property, value);
        const context = hooks.changeContext.call(initialContext);

        const stopChange = hooks.prechange.call(context);

        if (stopChange)
            return true;

        target[property] = proxiedValue;

        context.target = target;
        hooks.change.call(context);
        return true;
    },
    get(target, key) {
        let value = target[key]
        if (value !== undefined && key !== '__rootTarget') {
            if (typeof value === 'object') {
                console.log(value)
                value.__rootKey = getRootKey(target.__rootKey, key);

                return new Proxy(value, proxyConfig)
            }
            return value;
        }
        return new Proxy({}, proxyConfig)
    }
};


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

const data = new Proxy({}, proxyConfig);

export { hooks, data }