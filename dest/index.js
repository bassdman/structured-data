import { Databook } from '../src/index.js';


const databook = new Databook({
    fields: [{
        field: 'age',
        rules: {
            type: 'number',
            min: 6
        },
        transform: {
            custom: function(val) {
                return val - 2;
            }
        }
    }]
})

databook.data.age = 10;