require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const { dbConnect } = require('./config/dbConnect');
const authRoutes = require('./routers/authRoutes');
const userRoutes = require('./routers/userRoutes');
const eventRoutes = require('./routers/eventRoutes');
const ticketRoutes = require('./routers/ticketRoutes');
const { authenticateToken } = require('./middlewares/authenticateToken');
const errorHandler = require('./middlewares/errorHandler');
const nodemailer = require('nodemailer');
//const chapaRoutes = require('./routes/chapaRoutes');
const rateLimit = require('express-rate-limit');
const redis = require('redis'); 
const logger = require('./config/logger');


const app = express();
const redisClient = redis.createClient(); 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method')); // Support DELETE via _method query
app.set('view engine', 'ejs');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
//app.use('/chapa', chapaRoutes);0


// Static Routes for Views
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login', { messages: {} }));
app.get('/index', authenticateToken, (req, res) => res.render('index', { user: req.user }));




// Database connection
if (typeof dbConnect === 'function') {
    dbConnect();
} else {
    console.error('dbConnect is not a function');
}
////// newww
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per `windowMs`
    message: "Too many requests from this IP, please try again after a minute.",
  });
  app.use('/api/', limiter);


 /////// the below is the chace the duplacation of the db 
 redisClient.on('connect', () => {   // Log when Redis connects
    console.log('Connected to Redis!');
  });
  
  redisClient.on('error', (err) => {  // Log any errors with Redis
    console.error(`Redis error: ${err}`);
  });
  
  const eventListings = [
    { id: 1, title: 'Commerce Networking', date: '2024-12-20' },///my db 
    { id: 2, title: 'Leadership Workshop', date: '2024-12-22' },
  ];
  
  // Middleware to check cache
  const checkCache = (req, res, next) => {
    const key = 'events'; // Cache key for event listings
    redisClient.get(key, (err, data) => {
      if (err) throw err;
  
      if (data) {
        console.log('Cache hit!');          // Redis cache has the data
        res.send(JSON.parse(data));         // Send cached data as response
      } else {
        console.log('Cache miss!');         // Redis cache is empty
        next();                             // Proceed to fetch fresh data
      }
    });
  };
  
  // Route to get event listings with Redis caching
  app.get('/api/events', checkCache, (req, res) => {
    const key = 'events'; // Cache key
  
    // Simulating a delay as if fetching from a database
    setTimeout(() => {
      const data = JSON.stringify(eventListings); // Convert data to string format
  
      // Store data in Redis with a 1-minute expiry
      redisClient.setex(key, 60, data);           // (key, expiry_in_seconds, value)
      res.send(eventListings);                    // Send fresh data as response
    }, 2000); // Simulate database query delay
  });
  /////// the above is the chace the duplacation of the db 


  /////////logger 

// Middleware to log incoming requests
app.use((req, res, next) => {
    logger.info(`Received ${req.method} request for ${req.url}`);
    next(); // Move to the  middleware or route
  });
  
  // Sample route to log errors
  app.get('/api/events', (req, res) => {
    try {
      // Simulate an event fetch (could be a database query or other operation)
      throw new Error('Something went wrong!');
    } catch (error) {
      logger.error(`Error fetching events: ${error.message}`);
      res.status(500).send('Something went wrong');
    }
  });///// logger 
/// newww

// Logout route
app.get('/', (req, res) => {
    res.render('register'); // This renders the 'home.ejs' file
});

/// jitu this is the new thing you have to do
app.get('/login', (req, res) => {
    res.render('login', { messages: {} });
});

app.get('/index', authenticateToken, (req, res) => {
    res.render('index', { user: req.user });
});
  

// to accept or register a new user based on role
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const role = req.body.role || 'Attendee';

        // Save user to MongoDB
        const user = new User({ 
            name: req.body.name, 
            email: req.body.email,
            userName: req.body.userName,
            password: hashedPassword,
            role: role
        });

        await user.save();

        // this will send us to login page after successful registration
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Error registering user: ' + error.message);
    }
});

// login route to authenticate user from MongoDB
app.post('/login', async (req, res) => {
    try {
        // Find the user in MongoDB by email
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).render('login', { messages: { error: 'Cannot find user' } });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(403).render('login', { messages: { error: 'Invalid credentials' } });
        }

        // Generate JWT token
        const accessToken = jwt.sign({ 
            id: user._id, 
            name: user.name, 
            role: user.role 
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
        console.log("Generated JWT Token:", accessToken);

        // Set the token in a cookie
        res.cookie('token', accessToken, { httpOnly: true });

        // now we get to the index page depending on our role and password
        res.redirect('/index');
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
