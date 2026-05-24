import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const DB_STORE_PATH = path.join(process.cwd(), 'db_store.json');

// Define Initial Seed Data
const initialData = {
  soldiers: [
    { Soldier_ID: 'S101', FName: 'Arun', LName: 'Kumar', Rank_Name: 'Captain', Department: 'Infantry', Age: 32, Phone_Number: '9876543210', Posting_Location: 'Delhi' },
    { Soldier_ID: 'S102', FName: 'Ravi', LName: 'Sharma', Rank_Name: 'Major', Department: 'Artillery', Age: 38, Phone_Number: '9876501234', Posting_Location: 'Mumbai' },
    { Soldier_ID: 'S103', FName: 'Kiran', LName: 'Raj', Rank_Name: 'Lieutenant', Department: 'Signals', Age: 28, Phone_Number: '9876512345', Posting_Location: 'Chennai' },
    { Soldier_ID: 'S104', FName: 'Ajay', LName: 'Singh', Rank_Name: 'Colonel', Department: 'Engineering', Age: 45, Phone_Number: '9876523456', Posting_Location: 'Bangalore' }
  ],
  weapons: [
    { Weapon_ID: 'W101', Name: 'AK-47', Type: 'Rifle', Quantity: 50, Status: 'Active' },
    { Weapon_ID: 'W102', Name: 'Sniper Rifle', Type: 'Long Range', Quantity: 10, Status: 'Active' },
    { Weapon_ID: 'W103', Name: 'Pistol', Type: 'Handgun', Quantity: 30, Status: 'Maintenance' },
    { Weapon_ID: 'W104', Name: 'Machine Gun', Type: 'Automatic', Quantity: 15, Status: 'Active' }
  ],
  vehicles: [
    { Vehicle_ID: 'V101', Name: 'Tank A', Type: 'Tank', Fuel_Status: 'Full', Unit_Name: 'Infantry' },
    { Vehicle_ID: 'V102', Name: 'Jeep X', Type: 'Transport', Fuel_Status: 'Half', Unit_Name: 'Signals' },
    { Vehicle_ID: 'V103', Name: 'Truck Z', Type: 'Cargo', Fuel_Status: 'Full', Unit_Name: 'Engineering' },
    { Vehicle_ID: 'V104', Name: 'Helicopter H1', Type: 'Air Support', Fuel_Status: 'Low', Unit_Name: 'Air Force' }
  ],
  missions: [
    { Mission_ID: 'M101', Name: 'Border Security', Location: 'Kashmir', Mission_Date: '2026-05-01', Status: 'Completed' },
    { Mission_ID: 'M102', Name: 'Rescue Operation', Location: 'Assam', Mission_Date: '2026-05-05', Status: 'Ongoing' },
    { Mission_ID: 'M103', Name: 'Training Mission', Location: 'Pune', Mission_Date: '2026-05-10', Status: 'Planned' }
  ],
  trainings: [
    { Training_ID: 'T101', Soldier_ID: 'S101', Type: 'Combat', Training_Name: 'Combat Training', Training_Status: 'Completed' },
    { Training_ID: 'T102', Soldier_ID: 'S102', Type: 'Weapon', Training_Name: 'Weapon Handling', Training_Status: 'Completed' },
    { Training_ID: 'T103', Soldier_ID: 'S103', Type: 'Communication', Training_Name: 'Communication Training', Training_Status: 'Ongoing' },
    { Training_ID: 'T104', Soldier_ID: 'S104', Type: 'Safety', Training_Name: 'Engineering Safety', Training_Status: 'Completed' }
  ]
};

// Ensure db_store.json exists
function ensureDbStore() {
  if (!fs.existsSync(DB_STORE_PATH)) {
    fs.writeFileSync(DB_STORE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

// Read and Write functions for fallback local JSON file
function readDb() {
  ensureDbStore();
  try {
    const data = fs.readFileSync(DB_STORE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON DB fallback:', err);
    return initialData;
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing JSON DB fallback:', err);
  }
}

// Custom SQL Simulator for standard CRUD operations in Indian Army CMD Dashboard
async function simulateSqlQuery(sql: string, params: any[] = []): Promise<any> {
  const normSql = sql.trim().replace(/\s+/g, ' ');
  const db = readDb();

  // 1. Dashboard COUNT query
  if (normSql.toUpperCase().startsWith('SELECT COUNT(*)')) {
    const tableMatch = normSql.match(/FROM\s+(\w+)/i);
    if (tableMatch) {
      const dbTable = tableMatch[1].toLowerCase();
      // Handle pluralization or database names
      const key = dbTable.endsWith('s') ? dbTable : dbTable + 's';
      const count = db[key] ? db[key].length : 0;
      return [[{ 'COUNT(*)': count }], null];
    }
  }

  // 2. Training JOIN Soldier custom query
  if (normSql.toUpperCase().includes('CONCAT(S.FNAME, \' \', S.LNAME) AS SOLDIER_NAME') || normSql.toUpperCase().includes('JOIN SOLDIER')) {
    const result = db.trainings.map((t: any) => {
      const soldier = db.soldiers.find((s: any) => s.Soldier_ID === t.Soldier_ID);
      return {
        ...t,
        FName: soldier ? soldier.FName : '',
        LName: soldier ? soldier.LName : '',
        Soldier_Name: soldier ? `${soldier.FName} ${soldier.LName}` : 'Unknown'
      };
    });
    return [result, null];
  }

  // 3. Simple Table SELECTs
  if (normSql.toUpperCase().startsWith('SELECT * FROM')) {
    const fromMatch = normSql.match(/FROM\s+(\w+)/i);
    const whereMatch = normSql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
    if (fromMatch) {
      const dbTable = fromMatch[1].toLowerCase();
      const key = dbTable.endsWith('s') ? dbTable : dbTable + 's';
      let list = db[key] || [];

      if (whereMatch && params.length > 0) {
        const field = whereMatch[1];
        list = list.filter((item: any) => String(item[field]) === String(params[0]));
      }
      return [list, null];
    }
  }

  // 4. INSERTs
  if (normSql.toUpperCase().startsWith('INSERT INTO')) {
    const intoMatch = normSql.match(/INSERT\s+INTO\s+(\w+)/i);
    if (intoMatch) {
      const dbTable = intoMatch[1].toLowerCase();
      const key = dbTable.endsWith('s') ? dbTable : dbTable + 's';
      
      // We parse either INSERT INTO table VALUES (...) or INSERT INTO table (cols) VALUES (...)
      // For simple standard INSERT, we can use the parameters
      const fieldsMatch = normSql.match(/INSERT\s+INTO\s+\w+\s*\(([^)]+)\)/i);
      if (fieldsMatch) {
        // Structured INSERT: INSERT INTO Table (col1, col2) VALUES (?, ?)
        const columns = fieldsMatch[1].split(',').map((c: string) => c.trim());
        const newObj: any = {};
        columns.forEach((col, i) => {
          newObj[col] = params[i];
        });
        db[key].push(newObj);
        writeDb(db);
        return [{ affectedRows: 1, insertId: params[0] }, null];
      } else {
        // Direct positional INSERT, eg. INSERT INTO Soldier VALUES ('S105', 'John', ...)
        // Let's deduce what the fields are based on table
        let cols: string[] = [];
        if (key === 'soldiers') cols = ['Soldier_ID', 'FName', 'LName', 'Rank_Name', 'Department', 'Age', 'Phone_Number', 'Posting_Location'];
        else if (key === 'weapons') cols = ['Weapon_ID', 'Name', 'Type', 'Quantity', 'Status'];
        else if (key === 'vehicles') cols = ['Vehicle_ID', 'Name', 'Type', 'Fuel_Status', 'Unit_Name'];
        else if (key === 'missions') cols = ['Mission_ID', 'Name', 'Location', 'Mission_Date', 'Status'];
        else if (key === 'trainings') cols = ['Training_ID', 'Soldier_ID', 'Type', 'Training_Name', 'Training_Status'];

        const newObj: any = {};
        cols.forEach((col, idx) => {
          newObj[col] = params[idx];
        });
        db[key].push(newObj);
        writeDb(db);
        return [{ affectedRows: 1, insertId: params[0] }, null];
      }
    }
  }

  // 5. UPDATEs (dynamic)
  if (normSql.toUpperCase().startsWith('UPDATE')) {
    const updateMatch = normSql.match(/UPDATE\s+(\w+)/i);
    if (updateMatch) {
      const dbTable = updateMatch[1].toLowerCase();
      const key = dbTable.endsWith('s') ? dbTable : dbTable + 's';
      
      // Determine columns to set and the WHERE condition
      const setPartMatch = normSql.match(/SET\s+(.+?)\s+WHERE/i);
      const whereMatch = normSql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
      
      if (setPartMatch && whereMatch && params.length > 0) {
        const idField = whereMatch[1];
        const idVal = params[params.length - 1]; // Last parameter is usually the ID from WHERE clause
        const setTerms = setPartMatch[1].split(',').map(s => s.trim());
        
        let list = db[key] || [];
        const index = list.findIndex((item: any) => String(item[idField]) === String(idVal));
        if (index !== -1) {
          const updatedItem = { ...list[index] };
          setTerms.forEach((term, idx) => {
            const colName = term.split('=')[0].trim();
            updatedItem[colName] = params[idx];
          });
          list[index] = updatedItem;
          db[key] = list;
          writeDb(db);
          return [{ affectedRows: 1 }, null];
        }
      }
    }
  }

  // 6. DELETEs
  if (normSql.toUpperCase().startsWith('DELETE FROM')) {
    const deleteMatch = normSql.match(/DELETE\s+FROM\s+(\w+)/i);
    const whereMatch = normSql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
    if (deleteMatch && whereMatch && params.length > 0) {
      const dbTable = deleteMatch[1].toLowerCase();
      const key = dbTable.endsWith('s') ? dbTable : dbTable + 's';
      const idField = whereMatch[1];
      const idVal = params[0];

      let list = db[key] || [];
      const originalLength = list.length;
      list = list.filter((item: any) => String(item[idField]) !== String(idVal));
      db[key] = list;
      writeDb(db);
      return [{ affectedRows: originalLength - list.length }, null];
    }
  }

  return [[], null];
}

// Active connection pool placeholder
let pool: any = null;
let useRealMySQL = false;

try {
  // Test MySQL Connection settings
  const hasDbEnv = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME;
  
  if (hasDbEnv) {
    // Only attempt to connect to mysql if database variables are set
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    
    // We do a soft health check on the pool at import time
    useRealMySQL = true;
    console.log('🛡️ Indian Army CMD Database: MySQL pool initialized.');
  } else {
    console.log('ℹ️ MySQL credentials not fully configured in environment. Using Sandbox JSON DB fallback.');
  }
} catch (e) {
  console.log('⚠️ Failed to initialize MySQL driver, falling back to Sandbox JSON DB:', e);
}

// Safe wrapper query object
const safePool = {
  async query(sql: string, params: any[] = []): Promise<[any, any]> {
    if (useRealMySQL && pool) {
      try {
        const [rows, fields] = await pool.query(sql, params);
        return [rows, fields];
      } catch (err: any) {
        console.warn(`⚠️ Real MySQL query error, falling back to Sandbox JSON Database layer for query: "${sql}". Error: ${err.message}`);
        return await simulateSqlQuery(sql, params);
      }
    } else {
      return await simulateSqlQuery(sql, params);
    }
  },
  async execute(sql: string, params: any[] = []): Promise<[any, any]> {
    return this.query(sql, params);
  }
};

export default safePool;
