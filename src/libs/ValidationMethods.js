const ValidationMethods = {
    type: {
        validate: function(valueRule, valueContext, ctx) {
            return typeof valueContext == valueRule;
        }
    },
    max: {
        validate: function(valueRule, valueContext, ctx) {
            return valueContext <= valueRule;
        }
    },
    min: {
        validate: function(valueRule, valueContext, ctx) {
            return valueContext >= valueRule;
        }
    },
    minlength: {
        validate: function(valueRule, valueContext, ctx) {
            return valueContext && valueContext.length >= valueRule;
        }
    },
    maxlength: {
        validate: function(valueRule, valueContext, ctx) {
            return valueContext && valueContext.length <= valueRule;
        }
    },
    pattern: {
        validate: function(valueRule, valueContext, ctx) {
            return valueContext && valueContext.match(valueRule);
        }
    },
    custom: {
        validate: function(valueRule, valueContext, ctx) {
            return valueContext && valueContext(valueRule, valueContext, ctx);
        }
    },
    isNull: {
        validate: function(valueRule, valueContext, ctx) {
            if (valueRule)
                return !valueContext;
            else
                return ctx.value;
        }
    },
    isNotNull: {
        validate: function(valueRule, valueContext, ctx) {
            if (valueRule)
                return valueContext;
            else
                return !ctx.value;
        }
    },
}



export { ValidationMethods }