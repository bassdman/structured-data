function ValidateConfigPlugin() {
    const usedKeys = ['name', 'hooks', 'init', 'allowKeys', 'desactivateKeyCheck', 'plugins'];
    let desactivateKeyCheck = false;

    return {
        name: 'ValidateConfigPlugin',
        hooks: {
            initPlugin(config, ctx) {
                if (config.allowKeys)
                    usedKeys.push(...config.allowKeys);

                if (config.desactivateKeyCheck)
                    desactivateKeyCheck = config.desactivateKeyCheck;
            },
            pluginsInitialized(ctx) {
                if (desactivateKeyCheck)
                    return;

                for (let plugin of ctx.plugins) {
                    for (let key of Object.keys(plugin)) {
                        if (!usedKeys.includes(key))
                            throw `Config attribute "${key}" is used but not allowed. Allowed are ${usedKeys.join(', ')}. 
                            You want to disable this proove? set desactivateKeyCheck:true.
                            You want to allow another config attributes? Add allowKeys:['yourkeyname'].`
                    }
                }
            }
        },
    }
}

export { ValidateConfigPlugin }