export const preCommit = () => {
    const r = Math.random();
    if (r < 0.33) {
        return true;
    } else if (r < 0.66) {
        return false;
    } else {
        throw new Error("Cannot commit now");
    }
}