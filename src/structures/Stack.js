export class Stack {
    #items = [];                       // za enkapsulizaciju, da ne pristupi spolja

    push(item)  { this.#items.push(item); }
    pop()       { return this.#items.pop(); }
    peek()      { return this.#items[this.#items.length - 1]; }
    isEmpty()   { return this.#items.length === 0; }
    size()      { return this.#items.length; }
    clear()     { this.#items = []; }
}
