import { HooksPlugin } from './plugins/hooks.plugin.js';
import { DataStorePlugin } from './plugins/datastore.plugin.js';
import { DataTypePlugin } from './plugins/datatype.plugin.js'

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

addPlugin(HooksPlugin);
addPlugin(DataStorePlugin)
addPlugin(DataTypePlugin());


function Databook(config) {
    return addPlugin(config);
}

export { Databook }