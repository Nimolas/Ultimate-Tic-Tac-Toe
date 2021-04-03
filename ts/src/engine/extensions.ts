declare global {
    interface Array<T> {
        last(): T;
    }
}

Array.prototype.last = function (this: any[]): any {
    return this[this.length - 1];
}

export { }