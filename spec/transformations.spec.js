import { StructuredData } from './generated/index.js';

const _fields = {};

async function proove(_conf) {
    if (_fields[_conf.field])
        throw 'Field with name "' + _conf.field + '" is already used in this test. Use anotherone.';
    _fields[_conf.field] = true;

    const conf = Object.assign({}, {
        value: 'test',
        rulesValue: 'test'
    }, _conf);

    const structuredData = await StructuredData({
        fields: [{
            field: conf.field,
            transform: conf.transform,
            rules: [
                { equals: conf.rulesValue },
            ],
        }]
    });

    structuredData.data[conf.field] = conf.value;

    return structuredData;
}

describe("Transformations: ", function() {


    describe("general:", function() {
        it('fieldvalue "test" should be valid if no transformation applied', async function() {
            expect(async function() {
                await proove({ field: 'test' })
            }).not.toThrow();

        })
    });

    describe("for every transformation::", function() {
        it('fieldvalue "   test    " should be not valid if no transformation applied', async function() {
            expect(async function() {
                await proove({ field: 'test2', value: '   value    ' });
            }).not.toThrow();
        })
    });

    describe("Trim()", function() {

    });


});