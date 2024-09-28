let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let  { open } = require("sqlite");

let app = express();
let PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

let db;

// Initialize sqlite database connection
(async () => {
  db = await open({
    filename: './Backend/database.sqlite',
    driver: sqlite3.Database,
  });
  console.log("Database connected.");
})();

// function to fetch all companies
async function fetchAllCompanies(){
  let query = "SELECT * FROM companies";
  let response = await db.all(query, []);
  return { companies: response }
}

// Route to all companies
app.get("/companies", async (req, res)=>{
 try{
   let results = await fetchAllCompanies();

   if(results.companies.length === 0){
     res.status(404).json({ message: "No companies found." })
   }
 
   res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// function to fetch companies by industry
async function fetchCompaniesByIndustry(industry){
  let query = "SELECT * FROM companies WHERE industry = ?";
  let response = await db.all(query, [industry]);
  return { companies: response };
}

// Route to fetch companies by industry
app.get("/companies/industry/:industry", async (req, res)=>{
 try{ 
 let industry = req.params.industry;
 let results = await fetchCompaniesByIndustry(industry);
 
 if(results.companies.length === 0){
   res.status(404).json({ message: "No Companies Found in this insutry." });
 }

 res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// Function to fetch companies by revenue range
async function fetchCompaniesByRevenueRange(minRevenue, maxRevenue) {
  let query = "SELECT * FROM companies WHERE revenue BETWEEN ? AND ?";
  let response = await db.all(query, [minRevenue, maxRevenue]);
  return response; 
}

// Route to fetch companies by revenue range
app.get("/companies/revenue", async (req, res) => {
  try {
    
    let minRevenue = parseInt(req.query.minRevenue);
    let maxRevenue = parseInt(req.query.maxRevenue);    
    if (isNaN(minRevenue) || isNaN(maxRevenue)) {
      return res.status(400).json({ message: "Invalid revenue range provided." });
    }
  
    let companies = await fetchCompaniesByRevenueRange(minRevenue, maxRevenue);
    
    if (companies.length === 0) {
      return res.status(404).json({ message: "No companies found within this revenue range." });
    }
    res.status(200).json({ companies });   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to fetch companies by employees count
async function fetchCompaniesByEmployeesCount(employeesCount){
  let query = "SELECT  * FROM companies WHERE employee_count < ?";
  let response = await db.all(query, [employeesCount]);
  return { companies: response };
}


// Route to fetch companies by employee count
app.get("/companies/employees/:employeesCount", async (req, res)=>{
  try{
    let employeesCount = parseInt(req.params.employeesCount);
    let results = await fetchCompaniesByEmployeesCount(employeesCount);

    if(results.companies.length === 0){
      res.status(404).json({ message: "No companies found with less than this employee count." });
    }

    res.status(200).json(results);
  }catch(error){
    res.status(500).json({ error: error.message });
  }
});

// function to fetch companies by founded year
async function fetchCompaniesByFoundedYear(founded_year){
  let query = "SELECT * FROM companies WHERE founded_year = ?";
  let response = await db.all(query, [founded_year]);
  return { companies: response };
}

// Route to fetch companies by founded year
app.get("/companies/founded_year/:founded_year", async (req, res)=>{
 try{
   let founded_year = parseInt(req.params.founded_year);
   let results = await fetchCompaniesByFoundedYear(founded_year);

   if(results.companies.length === 0){
     res.status(404).json({ message: "No company founded in this year." });
   }

   res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// Start server
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));