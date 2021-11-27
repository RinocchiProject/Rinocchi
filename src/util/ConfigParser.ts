function Parse(content: string): any[] {
    let results = [],
        regex = /(?<=\]).+?(?=\[)/gs;
    content.match(regex).forEach((list: string) => {
        let props = list.split('\n'),
            obj = {};
        props.forEach((prop) => {
            let val = prop.split(':');
            if (val[0].length < 1) return;
            obj[String(val[0]).toUpperCase()] = String(val[1]).trim();
        });
        results.push(obj);
    });
    return results;
}

export default Parse;

/*
 Créditos: cdleary
 [https://stackoverflow.com/questions/1086404/string-to-object-in-js]
*/
