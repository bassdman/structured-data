const DefaultTransformations = {
    trim: {
        transform: function(value, contextVal, ctx) {
            return value.trim()
        }
    },
    replace: {
        transform: function(value, contextVal, ctx) {
            return value.trim()
        }
    },
    custom: {
        transform: function(value, contextVal, ctx) {
            return contextVal(value, contextVal, ctx)
        }
    },
    lowercase: {
        transform: function(value, contextVal, ctx) {
            return value.toLowerCase();
        }
    },
    uppercase: {
        transform: function(value, contextVal, ctx) {
            return value.toUpperCase();
        }
    },
}

export { DefaultTransformations }