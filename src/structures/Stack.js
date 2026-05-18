// Predvidjeno za navigacioni stek menija (vidi ANALIZA.md, tacka 4.1).
// Za sada nije uvezan nigde - ceka integraciju u glavnu petlju.

export class Stack {
    #items = [];                       // privatno polje

    push(item)  { this.#items.push(item); }
    pop()       { return this.#items.pop(); }
    peek()      { return this.#items[this.#items.length - 1]; }
    isEmpty()   { return this.#items.length === 0; }
    size()      { return this.#items.length; }
    clear()     { this.#items = []; }
}
