import { hooks, data } from './datastore.js';


hooks.change.tap('test3', function(context) {
    console.log('hi', context)
    return 15;
})

/*data.def = 14;

data.xyz = "hallo";

data.xyz = 'warum';

data.xyz = undefined;*/

data.xyz = {
    abc: {
        def: 'hallo'
    }
}

data.xyz.abc.def = 'servus'