const sql = require('mssql/msnodesqlv8');

const connectionString = `Driver={ODBC Driver 18 for SQL Server};Server=DESKTOP-RTKNA5I\\SQLEXPRESS;Database=ShvydkoFoodDb;Trusted_Connection=Yes;TrustServerCertificate=Yes;Encrypt=No;`;

const config = {
  connectionString: connectionString,
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
    encrypt: false,
  }
};

console.log('Testing connection with connectionString:', connectionString);

const pool = new sql.ConnectionPool(config);

pool.on('error', (error) => {
  console.error('Pool error:', error);
});

pool.connect((err) => {
  if (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
  
  console.log('Connected successfully!');
  
  const request = new sql.Request(pool);
  request.query('SELECT @@version as version', (err, result) => {
    if (err) {
      console.error('Query error:', err);
      pool.close();
      process.exit(1);
    }
    
    console.log('Query result:', result.recordset);
    pool.close();
    process.exit(0);
  });
});
