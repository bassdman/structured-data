import { DefaultValidationMethods } from "../libs/ValidationMethods.js";
import { DefaultTransformations } from "../libs/Transformations.js"

/**
 * 
 * fields: [{
 *      name: 'abc',
 *      type: 'xyz'
 * }]
 */
function DataTypePlugin(conf) {
    let fields = [];
    let validationMethods = DefaultValidationMethods;
    let transformations = DefaultTransformations;

    return {
        name: 'DataTypePlugin',
        allowKeys: ['validationMethods', 'fields', 'transformations'],
        init(config, ctx) {
            return {
                addFields(conf) {
                    if (Array.isArray(conf))
                        fields.push(...conf);
                    else
                        fields.push(conf);
                },
                addTransformations(conf) {
                    if (Array.isArray(conf))
                        transformations.push(...conf);
                    else
                        transformations.push(conf);
                },
                addValidationMethods(conf) {
                    if (Array.isArray(conf))
                        validationMethods.push(...conf);
                    else
                        validationMethods.push(conf);
                }
            }
        },
        hooks: {
            initPlugin: function(config, ctx) {
                if (config.validationMethods)
                    validationMethods = Object.assign(ValidationMethods, config.validationMethods);

                if (config.fields)
                    fields.push(...config.fields);

                if (config.transformations)
                    transformations = Object.assign(transformations, config.transformations);
            },
            prechange: function(event) {
                const isValid = fields.filter(val => val.field == event.property).some(conf => {

                    const rules = initRules(conf.rules);

                    for (let rule of rules) {
                        const validationEntry = validationMethods[rule.name];

                        if (!validationEntry)
                            throw new Error('There is no validationtype for "' + rule.name + '"')

                        const validationFn = validationEntry.validate;

                        if (!validationFn)
                            throw new Error('There is no validationtype for "' + conf.type + '"')

                        const evt = {
                            ruleName: rule.name,
                            ruleValue: rule.value,
                            contextValue: transform(event.newValue, conf, transformations),
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
            }
        },
    }
}

function transform(value, field, transformations) {
    if (field.transform === undefined)
        return value;

    let currentVal = value;
    for (let transformationKey of Object.keys(field.transform)) {
        const transformationConfig = transformations[transformationKey];
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

function ruleMatches(rule, event) {
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

    return result;
}

export { DataTypePlugin, ruleMatches }