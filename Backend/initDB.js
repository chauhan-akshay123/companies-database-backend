
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./Backend/database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create a company_details table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      industry TEXT,
      founded_year INTEGER,
      headquarters TEXT,
      revenue REAL,
      employee_count INTEGER
    )`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Company details table created or already exists.');
      }
    }
  );

  // Insert random company data
  const stmt = db.prepare(
    'INSERT INTO companies (name, industry, founded_year, headquarters, revenue, employee_count) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const companies = [
    {
        name: 'TechCorp',
        industry: 'Technology',
        founded_year: 1998,
        headquarters: 'San Francisco, CA',
        revenue: 2000,
        employee_count: 5000
    },
    {
        name: 'HealthInc',
        industry: 'Healthcare',
        founded_year: 2005,
        headquarters: 'New York, NY',
        revenue: 1500,
        employee_count: 3000
    },
    {
        name: 'EduTech',
        industry: 'Education',
        founded_year: 2005,
        headquarters: 'Boston, MA',
        revenue: 1800,
        employee_count: 1200
    },
    {
        name: 'AutoMotive',
        industry: 'Automobile',
        founded_year: 1995,
        headquarters: 'Detroit, MI',
        revenue: 5000,
        employee_count: 10000
    },
    {
        name: 'EduServices',
        industry: 'Education',
        founded_year: 1990,
        headquarters: 'Chicago, IL',
        revenue: 4000,
        employee_count: 8000
    },
    {
        name: 'ClickOne',
        industry: 'Media',
        founded_year: 2000,
        headquarters: 'Los Angeles, CA',
        revenue: 1200,
        employee_count: 2500
    },
    {
        name: 'MediaWorks',
        industry: 'Media',
        founded_year: 1995,
        headquarters: 'Atlanta, GA',
        revenue: 3000,
        employee_count: 6000
    },
    {
        name: 'RetailWorld',
        industry: 'Retail',
        founded_year: 1970,
        headquarters: 'Dallas, TX',
        revenue: 6000,
        employee_count: 15000
    },
    {
        name: 'TechOne',
        industry: 'Technology',
        founded_year: 1990,
        headquarters: 'Miami, FL',
        revenue: 1000,
        employee_count: 2000
    },
    {
        name: 'GreenEnergy',
        industry: 'Energy',
        founded_year: 2015,
        headquarters: 'Denver, CO',
        revenue: 500,
        employee_count: 800
    }
];


  for (let company of companies) {
    stmt.run(
      company.name,
      company.industry,
      company.founded_year,
      company.headquarters,
      company.revenue,
      company.employee_count
    );
  }
  stmt.finalize();

  console.log('Inserted company details into the database.');

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});