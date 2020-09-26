const DefaultValidationMethods = {
    type: {
        validate: function(event) {
            if (event.ruleValue.toLowerCase() == 'array')
                return Array.isArray(event.contextValue);

            return typeof event.contextValue == event.ruleValue;
        }
    },
    max: {
        validate: function(event) {
            return event.contextValue <= event.ruleValue;
        }
    },
    equals: {
        validate: function(event) {
            return event.contextValue === event.ruleValue;
        }
    },
    min: {
        validate: function(event) {
            return event.contextValue >= event.ruleValue;
        }
    },
    minlength: {
        validate: function(event) {
            return event.contextValue && event.contextValue.length >= event.ruleValue;
        }
    },
    maxlength: {
        validate: function(event) {
            return event.contextValue && event.contextValue.length <= event.ruleValue;
        }
    },
    pattern: {
        validate: function(event) {
            return event.contextValue && event.contextValue.match(event.ruleValue);
        }
    },
    custom: {
        validate: function(event) {
            return event.contextValue && event.contextValue(event);
        }
    },
    isNull: {
        validate: function(event) {
            if (event.ruleValue)
                return !event.contextValue;
            else
                return ctx.value;
        }
    },
    isNotNull: {
        validate: function(event) {
            if (event.ruleValue)
                return event.contextValue;
            else
                return !ctx.value;
        }
    },
    inList: {
        validate: function(event) {
            return event.ruleValue.includes(event.contextValue);
        }
    },
    notInList: {
        validate: function(event) {
            return !event.ruleValue.includes(event.contextValue);
        }
    },
    contains: {
        validate: function(event) {
            return event.contextValue.includes(event.ruleValue);
        }
    },
    notContains: {
        validate: function(event) {
            return !event.contextValue.includes(event.ruleValue);
        }
    },
    or: {
        validate: function(event) {
            console.log(event)
            return event.ruleValue.some(rule => {

            });
        }
    }
}



export { DefaultValidationMethods }