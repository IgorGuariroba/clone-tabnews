const dotenv = require("dotenv");
const path = process.env.NODE_ENV !== "production" ? '.env.development' : '.env.production';
dotenv.config({ path: path });