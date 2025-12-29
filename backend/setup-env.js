const fs = require('fs');
const path = require('path');

const envContent = `MONGO_URI=mongodb+srv://keerti1632:XZRO62HvGXfTEmmN@fitness.r8mn7nm.mongodb.net/?retryWrites=true&w=majority&appName=Fitness
JWT_SECRET=f25b99a9e0e3b02a5c5c89f28860b64ab2a46bf211bf6a5c413a4e3360a0b0bd
PORT=5000
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please restart your backend server to load the new environment variables.');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
} 