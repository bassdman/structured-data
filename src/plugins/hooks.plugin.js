function InitHooksPlugin(ctx) {
    return {
        name: 'InitHooksPlugin',
        hooks: {
            initPlugin: function(config, ctx) {
                if (config.addHooks) {
                    for (let hookname of Object.keys(config.addHooks)) {
                        ctx.hooks[hookname] = config.addHooks[hookname];
                    }
                }

                if (config.hooks) {
                    for (let hookname of Object.keys(config.hooks)) {
                        if (!ctx.hooks[hookname])
                            throw new Error('Hook with name "' + hookname + '" does not exist in plugin ' + config.name + ' . Is it correctly written? If yes, initialize it first with config attribute "addHooks"');

                        ctx.hooks[hookname].tap(config.name, config.hooks[hookname]);
                    }
                }
            }
        },
        init(config, globalConfig, ctx) {
            ctx.addHooks = function(obj) {
                for (let key of Object.keys(obj)) {
                    ctx.hooks[key] = obj[key];
                }
            }
            ctx.on = function(name, pluginname, fn) {
                if (!ctx.hooks[name])
                    throw new Error('Hook with name "' + name + '" does not exist. context.on(name, pluginname, fn) failed');

                return ctx.hooks[name].tap(pluginname, fn);
            }
        }
    }
}

export { InitHooksPlugin }