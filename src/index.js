import { InitHooksPlugin } from './plugins/hooks.plugin.js';
import { DataStorePlugin } from './plugins/datastore.plugin.js';
import { DataTypePlugin } from './plugins/datatype.plugin.js'

import { AsyncHook } from './libs/hooks.js';

async function addPlugin(plugin, ctx) {

    if (typeof plugin == 'function') {
        plugin(ctx);
        return;
    }

    await ctx.hooks.applyPlugin.call(plugin, ctx);

    if (plugin.init) {
        ctx.hooks.init.tap('plugininit', function() {
            plugin.init(ctx);
        });
    }

    for (let _plugin of plugin.plugins || []) {
        addPlugin(_plugin);
    }

    if (plugin.fields)
        ctx._fields.push(...plugin.fields);

    return ctx;
}

async function Databook(config) {
    let ctx = {
        _fields: [],
        config,
        hooks: {
            applyPlugin: new AsyncHook(),
            pluginsApplied: new AsyncHook(),
            init: new AsyncHook(),
        }
    };

    InitHooksPlugin(ctx)
    DataStorePlugin(ctx);
    addPlugin(DataTypePlugin(ctx), ctx);

    await addPlugin(config, ctx);
    await ctx.hooks.init.call(ctx, ctx.config);

    return ctx;
}

export { Databook }