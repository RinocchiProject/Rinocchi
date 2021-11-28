import mysql from 'mysql';

const { DATABASE, PORT, HOST, PASSWORD, USERNAME } = global.settings;

const connection = mysql.createConnection({
    host: HOST,
    port: Number(PORT),
    user: USERNAME,
    password: PASSWORD,
    database: DATABASE,
    ssl: {},
});

function query(sql: string, values: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, function (err, results, fieds) {
            if (err) reject(err);
            else resolve({ fieds: fieds, results: results });
        });
    });
}

export default { query, connection };
