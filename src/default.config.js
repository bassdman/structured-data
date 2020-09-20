import { HooksPlugin } from './plugins/hooks.plugin.js';
import { DataStorePlugin } from './plugins/datastore.plugin.js';
import { DataTypePlugin } from './plugins/datatype.plugin.js'

const DefaultConfig = {
    plugins: [
        HooksPlugin,
        DataStorePlugin,
        DataTypePlugin
    ]
}

export default DefaultConfig;