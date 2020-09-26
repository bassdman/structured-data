import { InitHooksPlugin } from './plugins/hooks.plugin.js';
import { DataStorePlugin } from './plugins/datastore.plugin.js';
import { DataTypePlugin } from './plugins/datatype.plugin.js';
import { ValidateConfigPlugin } from './plugins/validateConfig.plugin.js'


const DefaultConfig = {
    name: 'DefaultPlugins',
    plugins: [
        /*
            Enables adding {
                desactivateKeyCheck: true|false,
                allowKeys: ['keyx']
            } to the config.

            Adds structuredData.on() and structuredData.addHooks() to the interface
        */
        ValidateConfigPlugin(),

        /*
            Enables adding {
                hooks: { foo: 'bar' },
                addHooks: { foo: 'bar' }
            } to the config.

            Adds structuredData.on() and structuredData.addHooks() to the interface
        */
        InitHooksPlugin(),

        /*
            Enables adding {
                data: anydata
            } to the config.

            Adds structuredData.data to the interface
        */
        DataStorePlugin(),

        /*
            Enables adding {
                validationMethods: { foo: 'bar' },
                fields: { foo: 'bar' }
                transformations: { foo: 'bar' }
            } to the config.
        */
        DataTypePlugin()
    ]
}

export { DefaultConfig };