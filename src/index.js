import { HooksPlugin } from './plugins/hooks.plugin.js';
import { DataStorePlugin } from './plugins/datastore.plugin.js';
import { DataTypePlugin } from './plugins/datatype.plugin.js'

let ctx = {};

function addPlugin(plugin) {
    plugin(ctx);
}

addPlugin(HooksPlugin);
addPlugin(DataStorePlugin)
addPlugin(DataTypePlugin);

export { addPlugin }