function clamp(x, min, max) {
    return Math.max(Math.min(x, max), min);
}

class ArrayUtilities {
    static ProductOfLastN(array, n) {
        // From the end of the array, how many spots forward to walk
        const cutoff = clamp(array.length - n, 0, array.length);
        return array.reduceRight(
            (totalProduct, currentValue, currentIndex) => {
                if (currentIndex < cutoff) return totalProduct;
                return totalProduct * currentValue;
            },
            1
        );
    }
}


if (typeof window === 'undefined') {
    module.exports.ArrayUtilities = ArrayUtilities;
}