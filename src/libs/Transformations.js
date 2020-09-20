const Transformations = {
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
    }
}

export { Transformations }