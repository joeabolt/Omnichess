const IndexRenderers = {
    implementations: {
        number: (lengths, id) => id.toString(),
        chess: (lengths, id) => {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            if (id < 0) {
                return '';
            }

            id--;
            let builder = '';
            for (let i = lengths.length - 1; i >= 0; i--)
            {
                var dimInd = id % lengths[i]
                if (i%2 == 0)
                {
                    builder += (dimInd + 1).toString();
                }
                else
                {
                    builder += alphabet[dimInd];
                }
                id = Math.floor(id / lengths[i]);
            }
            return builder;
        }
    },
};

IndexRenderers.getRenderer = (name) => {
    if (IndexRenderers.implementations.hasOwnProperty(name))
    {
        return IndexRenderers.implementations[name];
    }
    else
    {
        return IndexRenderers.implementations['number'];
    }
}
