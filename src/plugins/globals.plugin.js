function GlobalsPlugin() {
    return {
        name: 'GlobalsPlugin',
        init(config, ctx) {
            ctx.hooks.initPlugin.tap("GlobalsPlugin", function(conf) {
                if (conf.global) {
                    for (let global of Object.keys(conf.global)) {
                        ctx.global = global;
                    }
                }
            });
        }
    }
}

export { GlobalsPlugin }