class Utilities {
    static getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomFloat(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    static removeElement(list: any[], element: any): any {
        return list.splice(list.indexOf(element), 1)
    }
}

export { Utilities }