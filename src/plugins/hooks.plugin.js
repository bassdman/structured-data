function HooksPlugin(ctx) {
    ctx.hooks = {};
    ctx.addHooks = function(obj) {
        for (let key of Object.keys(obj)) {
            ctx.hooks[key] = obj[key];
        }
    }
    ctx.on = function(name, pluginname, fn) {
        const hooks = name.split(" ");
        if (!ctx.hooks[name])
            throw new Error('Hook with name "' + name + '" does not exist. context.on(name, pluginname, fn) failed');

        return ctx.hooks[name].tap(pluginname, fn);
    }
}

export { HooksPlugin }