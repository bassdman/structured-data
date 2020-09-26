async function throwsErrors(cb) {
    try {
        await cb();
        return false;
    } catch (e) {
        return true;
    }
}

export { throwsErrors }