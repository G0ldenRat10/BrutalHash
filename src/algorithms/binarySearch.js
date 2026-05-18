// Binarna pretraga nad nizom sortiranim po hash-u. Vraca rec ili null. O(log n).
// Preduslov: niz mora biti sortiran po istom kljucu (hash) - vidi ANALIZA.md, tacka 4.2/4.3.
// Za sada nije uvezan nigde - ceka integraciju u indeksirani napad.

export function binarySearchByHash(sortedIndex, targetHash) {
    let lo = 0, hi = sortedIndex.length - 1;
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const h   = sortedIndex[mid].hash;
        if      (h === targetHash) return sortedIndex[mid].word;
        else if (h <  targetHash)  lo = mid + 1;
        else                        hi = mid - 1;
    }
    return null;
}
