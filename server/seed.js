import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/fashionhub";
const client = new MongoClient(uri);

const categories = ["dresses", "tops", "bottoms", "outerwear"];
const statuses = ["active", "inactive"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  "Red",
  "Blue",
  "Black",
  "White",
  "Pink",
  "Navy",
  "Beige",
  "Green",
  "Yellow",
  "Purple",
  "Gray",
  "Brown",
  "Coral",
  "Teal",
  "Ivory",
];
const productPrefixes = [
  "Classic",
  "Modern",
  "Elegant",
  "Casual",
  "Vintage",
  "Chic",
  "Bohemian",
  "Luxury",
  "Premium",
  "Essential",
  "Trendy",
  "Sporty",
  "Cozy",
  "Slim",
  "Relaxed",
];
const productTypes = {
  dresses: [
    "Maxi Dress",
    "Mini Dress",
    "Midi Dress",
    "Wrap Dress",
    "Shift Dress",
    "A-Line Dress",
    "Cocktail Dress",
    "Sun Dress",
  ],
  tops: [
    "Blouse",
    "T-Shirt",
    "Crop Top",
    "Tank Top",
    "Cardigan",
    "Sweater",
    "Hoodie",
    "Polo Shirt",
  ],
  bottoms: [
    "Jeans",
    "Skirt",
    "Shorts",
    "Leggings",
    "Trousers",
    "Palazzo Pants",
    "Culottes",
    "Joggers",
  ],
  outerwear: [
    "Jacket",
    "Coat",
    "Blazer",
    "Parka",
    "Trench Coat",
    "Windbreaker",
    "Vest",
    "Poncho",
  ],
};

const departments = ["design", "production", "sales", "marketing", "hr"];
const positions = {
  design: [
    "Senior Designer",
    "Junior Designer",
    "Pattern Maker",
    "Creative Director",
    "Textile Designer",
  ],
  production: [
    "Production Manager",
    "Quality Control",
    "Machine Operator",
    "Warehouse Staff",
    "Logistics Coordinator",
  ],
  sales: [
    "Sales Manager",
    "Sales Associate",
    "Account Executive",
    "Retail Specialist",
    "E-commerce Manager",
  ],
  marketing: [
    "Marketing Manager",
    "Social Media Specialist",
    "Brand Strategist",
    "Content Creator",
    "PR Coordinator",
  ],
  hr: [
    "HR Manager",
    "Recruiter",
    "Payroll Specialist",
    "Training Coordinator",
    "Office Administrator",
  ],
};

const firstNames = [
  "Emma",
  "Olivia",
  "Ava",
  "Sophia",
  "Isabella",
  "Mia",
  "Charlotte",
  "Amelia",
  "Harper",
  "Evelyn",
  "Lily",
  "Grace",
  "Chloe",
  "Ella",
  "Aria",
  "Luna",
  "Zoe",
  "Nora",
  "Riley",
  "Layla",
  "James",
  "Liam",
  "Noah",
  "Oliver",
  "William",
  "Henry",
  "Lucas",
  "Benjamin",
  "Jack",
  "Alexander",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Anderson",
  "Taylor",
  "Thomas",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Thompson",
  "White",
  "Harris",
];

const supplierNames = [
  "Silk Road Textiles",
  "Golden Thread Co",
  "Premier Fabrics",
  "Elite Accessories",
  "Pacific Packaging",
  "Dragon Textiles",
  "Star Manufacturing",
  "Ocean Fabrics",
  "Summit Supplies",
  "Metro Materials",
  "Crown Accessories",
  "Apex Packaging",
  "Nova Textiles",
  "Zenith Manufacturing",
  "Evergreen Supplies",
  "Pioneer Fabrics",
  "Atlas Accessories",
  "Liberty Packaging",
  "Harmony Textiles",
  "Unity Manufacturing",
];
const supplierCategories = [
  "fabrics",
  "accessories",
  "packaging",
  "manufacturing",
];
const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "San Francisco",
  "Seattle",
  "Boston",
  "Miami",
  "Denver",
  "Portland",
  "Austin",
  "Nashville",
  "Atlanta",
  "Dallas",
];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randSubset(arr, min, max) {
  const count = randInt(min, max);
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomDate(startYear, endYear) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start));
}

function generateProducts(count) {
  const products = [];
  for (let i = 0; i < count; i++) {
    const cat = rand(categories);
    const prefix = rand(productPrefixes);
    const type = rand(productTypes[cat]);
    const color = rand(colors);
    products.push({
      name: `${prefix} ${color} ${type}`,
      image: "",
      price: parseFloat((Math.random() * 200 + 15).toFixed(2)),
      sizes: randSubset(sizes, 2, 5),
      colors: randSubset(colors, 1, 4),
      category: cat,
      status: Math.random() > 0.15 ? "active" : "inactive",
      inventory: randInt(0, 500),
      createdAt: randomDate(2023, 2025),
    });
  }
  return products;
}

function generateEmployees(count) {
  const employees = [];
  for (let i = 0; i < count; i++) {
    const dept = rand(departments);
    const fn = rand(firstNames);
    const ln = rand(lastNames);
    employees.push({
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${randInt(1, 999)}@fashionhub.com`,
      phone: `(${randInt(200, 999)}) ${randInt(100, 999)}-${randInt(1000, 9999)}`,
      department: dept,
      position: rand(positions[dept]),
      salary: parseFloat(
        (randInt(35, 120) * 1000 + randInt(0, 999)).toFixed(2),
      ),
      hireDate: randomDate(2018, 2025).toISOString().split("T")[0],
      status: Math.random() > 0.1 ? "active" : "inactive",
      createdAt: new Date(),
    });
  }
  return employees;
}

function generateSuppliers(count) {
  const suppliers = [];
  for (let i = 0; i < count; i++) {
    const idx = i % supplierNames.length;
    const suffix =
      i >= supplierNames.length
        ? ` #${Math.floor(i / supplierNames.length) + 1}`
        : "";
    const city = rand(cities);
    suppliers.push({
      companyName: `${supplierNames[idx]}${suffix}`,
      contactPerson: `${rand(firstNames)} ${rand(lastNames)}`,
      phone: `(${randInt(200, 999)}) ${randInt(100, 999)}-${randInt(1000, 9999)}`,
      email: `contact${i}@${supplierNames[idx].toLowerCase().replace(/\s+/g, "")}.com`,
      address: `${randInt(100, 9999)} ${rand(["Main St", "Oak Ave", "Broadway", "Market St", "Pine Rd"])}, ${city}`,
      categories: randSubset(supplierCategories, 1, 3),
      rating: randInt(1, 5),
      notes: rand([
        "Reliable delivery times",
        "Competitive pricing",
        "High quality materials",
        "Good customer service",
        "Fast turnaround",
        "Bulk discount available",
        "New supplier - under evaluation",
        "Preferred vendor",
        "",
      ]),
      createdAt: randomDate(2020, 2025),
      updatedAt: new Date(),
    });
  }
  return suppliers;
}

async function seed() {
  try {
    await client.connect();
    const db = client.db("fashionhub");

    console.log("Connected to MongoDB. Starting seed...");

    // Clear existing data
    await db.collection("products").deleteMany({});
    await db.collection("employees").deleteMany({});
    await db.collection("suppliers").deleteMany({});

    // Generate and insert
    const products = generateProducts(500);
    const employees = generateEmployees(300);
    const suppliers = generateSuppliers(250);

    await db.collection("products").insertMany(products);
    console.log(`Inserted ${products.length} products`);

    await db.collection("employees").insertMany(employees);
    console.log(`Inserted ${employees.length} employees`);

    await db.collection("suppliers").insertMany(suppliers);
    console.log(`Inserted ${suppliers.length} suppliers`);

    const total = products.length + employees.length + suppliers.length;
    console.log(`\nSeed complete! Total records: ${total}`);

    await client.close();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
