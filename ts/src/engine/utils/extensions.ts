declare global {
    interface Array<T> {
        last(): T;
        removeElement(element: T): Array<T>;
    }
    interface Number {
        getRandomInt(min: number, max: number): Number;
        getRandomFloat(min: number, max: number): Number;
    }
}

Array.prototype.last = function (this: any[]): any {
    return this[this.length - 1];
}

Array.prototype.removeElement = function (this: any[], element: any): any[] {
    return this.splice(this.indexOf(element), 1)
}

Number.prototype.getRandomInt = function (min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Number.prototype.getRandomFloat = function (min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export { }