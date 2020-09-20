import { ValidationMethods } from "../libs/ValidationMethods.js";
import { Transformations } from "../libs/Transformations.js"

/**
 * 
 * fields: [{
 *      name: 'abc',
 *      type: 'xyz'
 * }]
 */
function DataTypePlugin(conf) {
    return function(ctx) {
        ctx._validationMethods = Object.assign(ValidationMethods, ctx._validationMethods || {});

        ctx.on('prechange', 'validateFields', function(context) {
            const isValid = ctx._fields.filter(val => val.field == context.property).some(conf => {

                for (let rule of Object.keys(conf.rules || [])) {
                    const value = conf.rules[rule];
                    const validationEntry = ValidationMethods[rule];
                    const validationFn = validationEntry.validate;

                    if (!validationFn)
                        throw new Error('There is no validationtype for "' + conf.type + '"')

                    const result = validationFn(value, transform(context.newValue, conf), context);

                    if (!result)
                        throw validationEntry.errorMessage || `Validation failed for field "${conf.field}": Validationrule ${rule}:${value} failes. New value would be ${JSON.stringify(context.newValue)}`;
                }
            });

            return isValid;
        });
    }
}

function transform(value, field) {
    if (field.transform === undefined)
        return value;

    let currentVal = value;
    for (let transformationKey of Object.keys(field.transform)) {
        const transformationConfig = Transformations[transformationKey];
        const transformationValue = field.transform[transformationKey];
        const transformationFn = transformationConfig.transform;

        if (!transformationFn)
            throw new Error('There is no transformationfunction for "' + conf.type + '"');

        currentVal = transformationFn(currentVal, transformationValue, field);
    }
    return currentVal;
}

export { DataTypePlugin }