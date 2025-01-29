const express = require("express");
const cors = require("cors");
const dbConnection = require("./src/config/dbConnection");
const dotenv = require("dotenv");
const errorController = require("./src/controllers/errorController");
const userRoute = require("./src/routes/userRoute");
const bookRoute = require("./src/routes/bookRoute");
const oderRoute = require('./src/routes/orderRoute');
const bookInventoryRoute = require("./src/routes/bookInventoryRoute");

dotenv.config();
const app = express();
const port = process.env.PORT || 4001;

dbConnection();

app.use(cors());
app.use(express.json());

app.set("view engine","ejs");
app.set("views","./src/views");

app.use("/", (req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// app.get('/generate-report', async (req, res) => {
//   try {
//       // Load the HTML template
//       // const templatePath = path.join(__dirname, 'src/reports', 'bookReport1.hbs');
//       const templatePath = path.resolve('E:/Projects/MERN/Library Inventory Management/server/src/reports/bookReport1.hbs');

//       const templateContent = await fs.readFile(templatePath, 'utf8');

//       // Compile the template with Handlebars
//       const template = hbs.compile(templateContent);

//       // Data for the report
//       const reportData = {
//           date: new Date().toLocaleString(),
//           data: [
//               { name: 'Item 1', value: '100' },
//               { name: 'Item 2', value: '200' },
//               { name: 'Item 3', value: '300' },
//           ],
//       };

//       // Generate HTML from the template
//       const html = template(reportData);

//       // Convert HTML to PDF using Puppeteer
//       const browser = await puppeteer.launch({headless:false,slowMo:100});
//       const page = await browser.newPage()
//       await page.setContent(html, { waitUntil: 'load', timeout: 60000 });
//       const pdfBuffer = await page.pdf({ format: 'A4' });
//       await browser.close();

//       // Send the PDF as a response
//       res.setHeader('Content-Type', 'application/pdf');
//       res.send(pdfBuffer);
//   } catch (err) {
//       console.error('Error generating report:', err);
//       res.status(500).send('Error generating report');
//   }
// });


app.use("/api/user/", userRoute);
app.use("/api/book/", bookRoute);
app.use("/api/order/",oderRoute);
app.use("/api/bookInventory/",bookInventoryRoute);

app.use(errorController);

app.use(express.static('src/components'));


app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
