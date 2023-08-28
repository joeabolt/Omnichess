class ArrayUtilities {
    static ProductOfLastN(array, n) {
        const cutoff = Math.max(Math.min(array.length - n, array.length), 0);
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