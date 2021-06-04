const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();


// We’re gonna serve static files such as HTML files, CSS files and JavaScript files

const path = __dirname + '/app/views/';

app.use(express.static(path));
//
app.get('/', function (req,res) {
  res.sendFile(path + "index.html");
});

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));



const db = require("./app/models");
const Role = db.role;

const CONNECTION_URL = 'mongodb+srv://hajar:hajarbsf@cluster0.70rho.mongodb.net/GhdayafoodDB?retryWrites=true&w=majority'

//const PORT = process.env.PORT || 8080 ;


db.mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Successfully connect to MongoDB.");
  initial();
})
.catch(err => {
  console.error("Connection error", err);
  process.exit();
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

/*
db.mongoose.connection.once('open', () => {
     console.log('DB connected');
})


*/

/*
db.mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology:true })
   .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
   .catch(() => console.log(error.message));

db.mongoose.connection.once('open', () => {
     console.log('DB connected');
})
*/
/*
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
*/
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to GhdayaFood application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
//const PORT = process.env.PORT || 8080;
/*
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
*/
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
