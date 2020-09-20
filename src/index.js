import DefaultConfig from "./default.config.js";


let ctx = { _fields: [] };

function addPlugin(plugin) {
    if (typeof plugin == 'function') {
        plugin(ctx);
        return;
    }
    for (let _plugin of plugin.plugins || []) {
        addPlugin(_plugin);
    }

    if (plugin.fields)
        ctx._fields.push(...plugin.fields);

    return ctx;
}

function Databook(config) {
    addPlugin(DefaultConfig);
    return addPlugin(config);
}

export { Databook }