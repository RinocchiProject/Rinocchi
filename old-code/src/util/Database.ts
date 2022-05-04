import mysql from 'mysql';
import { obj as settings } from './ConfigParser';

const { DATABASE, PORT, HOST, PASSWORD, USERNAME } = settings;

const connection = mysql.createConnection({
    host: HOST,
    port: Number(PORT),
    user: USERNAME,
    password: PASSWORD,
    database: DATABASE,
    // only ssl on prod. database
    //ssl: {},
});

function query(sql: string, values: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, function (err, results, fieds) {
            if (err) reject(err);
            else resolve({ fieds: fieds, results: results });
        });
    });
}

export { query, connection };
