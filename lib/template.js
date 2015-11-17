'use strict';

let template = `'use strict';
    module.exports = function (BH) {
        var bh = new BH();
        bh.setOptions({
            jsAttrName: 'data-bem',
            jsAttrScheme: 'json'
        });

        {templates}

        return bh;
    };`;

module.exports = function gulpConcatBHTemplate(files) {
    let templates = files.map(file => {
        return `require('${file.path}')(bh);`;
    }).join('\n        ');

    return template.replace('{templates}', templates);
};
