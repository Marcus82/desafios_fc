const express = require('express') 
const app = express()
const port = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const mysql = require('mysql')
const connection = mysql.createConnection(config)
const tableName = 'people';

// Função para criar a tabela
const createTable = () => {
    return new Promise((resolve, reject) => {
        
        connection.query(`SHOW TABLES LIKE '${tableName}'`, (err, result) => {
            if (err) {
                reject(err);
                return;
            }

            if (result.length === 0) {
                const createTableQuery = `CREATE TABLE ${tableName}(id int not null auto_increment, name varchar(255), primary key(id))`;
                connection.query(createTableQuery, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log('Tabela criada com sucesso!');
                    resolve();
                });
            } else {
                console.log('A tabela já existe.');
                resolve();
            }
        });
    });
};

// Função para inserir registro na tabela
const insertRecord = (name) => {
    return new Promise((resolve, reject) => {
        // const tableName = 'people';
        const insertQuery = `INSERT INTO ${tableName}(name) values (?)`;
        connection.query(insertQuery, [name], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(`Registro inserido com sucesso. ID do novo registro: ${result.insertId}`);
            resolve();
        });
    });
};

// Função para consultar registros da tabela
const selectRecords = () => {
    return new Promise((resolve, reject) => {
        // const tableName = 'people';
        const selectQuery = `SELECT * FROM ${tableName}`;
        connection.query(selectQuery, (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Registros na tabela "people":');
            results.forEach((row) => {
                console.log(`ID: ${row.id}, Name: ${row.name}`);
            });
            resolve(results);
        });
    });
};

// Função principal
const main = async () => {
    try {
        await createTable();
        await insertRecord('Marcus Soares');
        const results = await selectRecords();
  
        // Fecha a conexão
        connection.end();
  
        // Inicie o servidor express
        app.get('/', (req, res) => {
            let htmlResponse = '<h1>Full Cycle</h1>';
            htmlResponse += '<h2>Lista de Nomes:</h2>';
            htmlResponse += '<ul>';
            results.forEach(person => {
                htmlResponse += `<li>ID: ${person.id}, Name: ${person.name}</li>`;
            });
            htmlResponse += '</ul>';
            res.send(htmlResponse);
        });
  
        app.listen(port, () => {
            console.log('Rodando na porta ' + port);
        });

    } catch (error) {
        console.error('Erro:', error);
        // Fecha a conexão 
        connection.end();
    }
};
  
// Inicie a execução
main();