import { InitHooksPlugin } from './plugins/hooks.plugin.js';
import { DataStorePlugin } from './plugins/datastore.plugin.js';
import { DataTypePlugin } from './plugins/datatype.plugin.js'

const DefaultConfig = {
    name: 'DefaultPlugins',
    plugins: [
        InitHooksPlugin(),
        DataStorePlugin(),
        DataTypePlugin()
    ]
}

export { DefaultConfig };