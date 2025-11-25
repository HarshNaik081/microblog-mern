const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

// Import models BEFORE using them
const Post = require('./models/Post');
const User = require('./models/User');  // ← ADD THIS LINE

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

async function exportToJSON() {
  await connectDB();

  try {
    console.log('🔄 Fetching posts from database...');
    
    const posts = await Post.find()
      .populate('author', 'username email')
      .lean();

    console.log(`📊 Found ${posts.length} posts`);

    if (posts.length === 0) {
      console.log('⚠️  No posts in database. Run "node seedData.js" first to add sample data.');
      process.exit(1);
    }

    fs.writeFileSync('analytics_data.json', JSON.stringify(posts, null, 2));
    console.log('✅ Data exported to analytics_data.json');
    
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

exportToJSON();
