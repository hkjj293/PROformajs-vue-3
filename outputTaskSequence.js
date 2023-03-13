var compMap = [];

import fs from 'fs';

let compJson = fs.readFileSync('./conponentsTree.json');
let compTree = JSON.parse(compJson);


for (var comp in compTree) {
    if (Object.keys(compTree[comp]).length <= 1) {
        compMap.push(comp);
    }
}

console.log(compMap);