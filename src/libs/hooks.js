class Hook {
    constructor() {
        this._listeners = {}
    }

    tap(name, listener) {
        if (name == undefined)
            throw new Error('Hook.on(): should be on(name:string, listener:function) but name is undefined');
        if (listener == undefined)
            throw new Error('Hook.on(): should be on(name:string, listener:function) but listener is undefined');

        this._listeners[name] = listener;
    }
    off(name) {
        if (name == undefined)
            throw new Error('Hook.off(): should be on(name:string, listener:function) but name is undefined');

        delete this._listeners[name];
    }
    listeners(name) {
        if (name)
            return this._listeners[name];
        else
            return Object.values(this._listeners);
    }
    trigger(ctx) {
        throw new Error('Hook.trigger() must be overwritten');
    }
    call() {
        return this.trigger(...arguments)
    }
}

class SyncHook extends Hook {
    trigger(ctx) {
        const events = this.listeners();
        for (let event of events) {
            event(ctx);
        }
    }
}

class AsyncHook extends Hook {
    async trigger(ctx) {
        const events = this.listeners();
        for (let event of events) {
            await event(ctx);
        }
    }
}

class SyncWaterfallHook extends Hook {
    trigger(ctx) {
        let result = ctx;
        const events = this.listeners();

        for (let event of events) {
            if (result == null)
                throw new Error('A listener in SyncWaterfallHook.trigger(context) returns null. This is not allowed. Did you forget returning sth in a listener?')
            result = event(result);
        }
        return result;
    }
}

class AsyncWaterfallHook extends Hook {
    async trigger(ctx) {
        let result = ctx;
        const events = this.listeners();

        for (let event of events) {
            result = await event(result);
        }
        return result;
    }
}

class SyncBreakableHook extends Hook {
    trigger(ctx) {
        const events = this.listeners();

        for (let event of events) {
            const result = event(ctx);
            if (!result)
                return;
        }
    }
}

class AsyncBreakableHook extends Hook {
    async trigger(ctx) {
        const events = this.listeners();

        for (let event of events) {
            const result = await event(ctx);
            if (!result)
                return;
        }
    }
}

export { Hook, SyncHook, AsyncHook, SyncWaterfallHook, AsyncWaterfallHook, SyncBreakableHook, AsyncBreakableHook }