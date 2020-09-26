import { StructuredData } from '../src/index.js';


const structuredData = await StructuredData({
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
                /*{
                                or: [
                                    { type: 'array' },
                                    { contains: 'f' },
                                ]
                            }*/
                { type: 'array' },
                { contains: 'c' },
            ],
        }
    ]
});

structuredData.on('change', 'test', function(ctx) {
    //console.log(...arguments)
    console.log('wird geaendert', ctx)
});

structuredData.data.age = 10;

structuredData.data.roommates = ['a', 'b', 'c', 'd']
    //structuredData.data.age = 5;
    //structuredData.data.age = 3;