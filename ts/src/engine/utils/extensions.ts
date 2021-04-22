declare global {
    interface Array<T> {
        last(): T;
        empty(): void;
        removeElement(element: T): Array<T>;
        removeElements(startIndex: number, endIndex: number): Array<T>;
        toJSONStrings(): string[];
    }
    interface NumberConstructor {
        getRandomInt(min: number, max: number): number;
        getRandomFloat(min: number, max: number): number;
    }
}

Array.prototype.last = function (this: any[]): any {
    return this[this.length - 1];
}

Array.prototype.removeElement = function (this: any[], element: any): any[] {
    return this.splice(this.indexOf(element), 1)
}

Array.prototype.removeElements = function (this: any[], index: number, amount: number): any[] {
    return this.splice(index, amount)
}

Array.prototype.empty = function (this: any[]): any[] {
    return this.removeElements(0, this.length);
}

Array.prototype.toJSONStrings = function (this: any[]): any[] {
    let strings: string[] = [];

    for (let object of this)
        strings.push(JSON.stringify(object));

    return strings;
}

Number.getRandomInt = function (min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Number.getRandomFloat = function (min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export { }