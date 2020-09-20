import { Databook } from '../src/index.js';


const databook = new Databook({
    fields: [{
        field: 'age',
        rules: {
            type: 'number',
            min: 6
        },
    }]
})


databook.on('change', 'test', function() {
    console.log('bin drin')
    console.log(...arguments)
});

databook.data.age = 10;
databook.data.age = 5;
databook.data.age = 3;