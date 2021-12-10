import { readFileSync } from 'fs';
function Parse(content: string): any[] {
    let results = [],
        regex = /(?<=\]).+?(?=\[)/gs;
    content.match(regex).forEach((list: string) => {
        let props = list.split('\n'),
            obj = {};
        props.forEach((prop) => {
            let val = prop.split('=');
            if (val[0].length < 1) return;
            obj[String(val[0]).trim().toUpperCase()] = String(val[1]).trim();
        });
        results.push(obj);
    });
    return results;
}

export default Parse;
const content = readFileSync('./CONFIG', 'utf-8'),
    obj = Object.assign({}, ...Parse(content));
export { obj };
/*
 Créditos: cdleary
 [https://stackoverflow.com/questions/1086404/string-to-object-in-js]
*/
