import { InitHooksPlugin } from './plugins/hooks.plugin.js';
import { DataStorePlugin } from './plugins/datastore.plugin.js';
import { DataTypePlugin } from './plugins/datatype.plugin.js'

const DefaultConfig = {
    name: 'DefaultPlugins',
    plugins: [
        /*
            Enables adding {
                hooks: {
                    foo: 'bar'
                },
                addHooks: {
                    foo: 'bar'
                }
            } to the config.

            Adds databook.on() and databook.addHooks() to the interface
        */
        InitHooksPlugin(),

        /*
            Enables adding {
                data: anydata
            } to the config.

            Adds databook.data to the interface
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