import { Databook } from '../src/index.js';


const databook = await Databook({
    fields: [{
            field: 'age',
            rules: [
                { type: 'number' },
                { min: 4 },
                { inList: [10, 11, 12, 13] }
            ],
        },
        {
            field: 'roommates',
            log: true,
            rules: [
                { type: 'array' },
                { contains: 'f' },
            ],
        }
    ]
});

databook.on('change', 'test', function(ctx) {
    //console.log(...arguments)
    console.log('wird geaendert', ctx)
});

databook.data.age = 10;

databook.data.roommates = ['a', 'b', 'c', 'd']
    //databook.data.age = 5;
    //databook.data.age = 3;