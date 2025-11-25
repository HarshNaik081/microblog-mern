const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Post = require('./models/Post');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

async function seedData() {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.insertMany([
      {
        username: 'HarshNaik',
        email: 'harsh@example.com',
        password: hashedPassword
      },
      {
        username: 'TechEnthusiast',
        email: 'tech@example.com',
        password: hashedPassword
      },
      {
        username: 'DataScientist',
        email: 'data@example.com',
        password: hashedPassword
      },
      {
        username: 'DevOpsGuru',
        email: 'devops@example.com',
        password: hashedPassword
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create sample posts over last 7 days
    const posts = [];
    const postContents = [
      'Just deployed my first MERN stack application! 🚀',
      'MongoDB aggregations are incredibly powerful for analytics',
      'Learning Power BI for data visualization dashboards',
      'Excited about my upcoming banking sector placement interviews!',
      'Built a real-time analytics platform today',
      'Working on customer behavior analysis project',
      'SQL queries are getting more interesting every day',
      'Finished implementing JWT authentication',
      'Dashboard metrics: DAU, MAU, engagement rate tracking',
      'MongoDB Atlas makes deployment so much easier',
      'React hooks simplified my component logic',
      'Exploring microservices architecture patterns',
      'Data cleaning is 80% of the analytics work!',
      'Power BI DAX formulas are similar to Excel',
      'Interview prep going strong for fintech roles',
      'Built a Kanban board with drag-and-drop functionality',
      'Node.js performance optimization tips',
      'Understanding RESTful API design principles',
      'Cohort analysis reveals interesting user patterns',
      'GitHub portfolio is finally looking professional!',
      'Material-UI components speed up development',
      'Aggregation pipelines > multiple queries',
      'Learning about database indexing strategies',
      'WebSocket integration for real-time updates',
      'Data visualization best practices matter',
      'Express middleware makes backend clean',
      'Mongoose schemas keep data structured',
      'Preparing for technical interviews daily',
      'Full-stack development is challenging but rewarding',
      'Analytics-driven decision making is the future'
    ];

    // Generate posts over last 7 days
    for (let i = 0; i < 30; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const daysAgo = Math.floor(Math.random() * 7); // Random day in last 7 days
      const hoursAgo = Math.floor(Math.random() * 24); // Random hour
      
      const postDate = new Date();
      postDate.setDate(postDate.getDate() - daysAgo);
      postDate.setHours(postDate.getHours() - hoursAgo);

      posts.push({
        content: postContents[i],
        author: randomUser._id,
        authorName: randomUser.username,
        likes: Math.floor(Math.random() * 15), // 0-15 likes
        comments: Math.floor(Math.random() * 8), // 0-8 comments
        createdAt: postDate
      });
    }

    await Post.insertMany(posts);
    console.log(`✅ Created ${posts.length} posts`);

    // Display statistics
    const stats = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          avgLikes: { $avg: '$likes' },
          totalComments: { $sum: '$comments' }
        }
      }
    ]);

    console.log('\n📊 Database Statistics:');
    console.log(`   Total Posts: ${stats[0].totalPosts}`);
    console.log(`   Total Likes: ${stats[0].totalLikes}`);
    console.log(`   Average Likes: ${stats[0].avgLikes.toFixed(2)}`);
    console.log(`   Total Comments: ${stats[0].totalComments}`);
    console.log('\n✅ Sample data seeded successfully!');
    console.log('🔑 Login credentials: harsh@example.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
