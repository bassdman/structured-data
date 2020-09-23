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
    return {
        init(ctx) {
            ctx._validationMethods = Object.assign(ValidationMethods, ctx._validationMethods || {});

            ctx.on('prechange', 'validateFields', function(event) {
                const isValid = ctx._fields.filter(val => val.field == event.property).some(conf => {

                    const rules = initRules(conf.rules);

                    for (let rule of rules) {
                        const validationEntry = ValidationMethods[rule.name];

                        if (!validationEntry)
                            throw new Error('There is no validationtype for "' + rule.name + '"')

                        const validationFn = validationEntry.validate;

                        if (!validationFn)
                            throw new Error('There is no validationtype for "' + conf.type + '"')

                        const evt = {
                            ruleName: rule.name,
                            ruleValue: rule.value,
                            contextValue: transform(event.newValue, conf),
                            event,
                            config: conf
                        };

                        if (evt.config.log)
                            console.log(evt);

                        const result = validationFn(evt);

                        if (!result)
                            throw validationEntry.errorMessage || `Validation failed for field "${conf.field}": Validationrule ${rule.name}:${rule.value} failes. New value would be ${JSON.stringify(event.newValue)}`;
                    }
                });

                return isValid;
            });
        }
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

function initRules(rules) {
    if (!Array.isArray(rules))
        rules = [rules];

    let returnRules = [];

    for (let rule of rules) {
        if (rule == null)
            return [];

        if (typeof rule == 'string') {
            returnRules.push({ name: rule, value: true });
        } else if (typeof rule == 'object') {
            const keys = Object.keys(rule);
            for (let key of keys) {
                returnRules.push({ name: key, value: rule[key] })
            }
        }
    };
    return returnRules;
}

export { DataTypePlugin }