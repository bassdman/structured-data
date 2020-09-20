function DataTypePlugin(ctx) {
    ctx.on('change', 'testevt', function(context) {
        console.log('tap works', context)
        return 15;
    });

    ctx.hooks.change.trigger(ctx)
}

export { DataTypePlugin }