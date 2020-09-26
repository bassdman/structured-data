import { DefaultConfig as DefaultPlugin } from './default.config.js';
import { AsyncHook } from './libs/hooks.js';

async function addPlugin(conf, ctx) {
    if (!conf.name)
        throw `Plugin ${JSON.stringify(conf)} has no name. Please define a name by adding an attribute name:"pluginname" to your plugin.`;

    if (typeof conf === 'function')
        throw `Plugin ${conf.name} is a function, but should be a configuration object. Did you forget calling it? (eg: PluginName())`;


    if (typeof conf !== 'object' || Array.isArray(conf))
        throw `Plugin ${conf.name} should be a configuration of type object, but is typeof ${typeof conf}.`;

    ctx.plugins.push(conf);

    if (conf.init) {
        const globals = await conf.init(conf, ctx);

        if (!globals._context && typeof globals == 'object') {
            for (let key of Object.keys(globals) || {}) {
                ctx[key] = globals[key];
            }
        }

    }

    if (conf.hooks && conf.hooks.initPlugin) {
        ctx.hooks.initPlugin.tap(conf.name, conf.hooks.initPlugin);
    }

    for (let _plugin of conf.plugins || []) {
        addPlugin(_plugin, ctx);
    }

    return ctx;
}

async function StructuredData(config = {}) {
    let ctx = {
        plugins: [],
        config,
        _context: true,
        hooks: {
            pluginsInitialized: new AsyncHook(),
            initPlugin: new AsyncHook(),
        }
    };

    if (!config.name)
        config.name = 'StructuredData';

    await addPlugin(DefaultPlugin, ctx);
    await addPlugin(config, ctx);

    for (let _plugin of ctx.plugins) {
        await ctx.hooks.initPlugin.call(_plugin, ctx);
    }

    ctx.hooks.pluginsInitialized.call(ctx);
    return ctx;
}

export { StructuredData }