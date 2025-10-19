const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/appstore')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const Category = require('./src/models/Category');

async function createDefaultCategories() {
  try {
    const categories = [
      { name: 'Games', slug: 'games', description: 'Entertainment and gaming applications' },
      { name: 'Productivity', slug: 'productivity', description: 'Tools to help you get things done' },
      { name: 'Education', slug: 'education', description: 'Learning and educational content' },
      { name: 'Utilities', slug: 'utilities', description: 'Useful tools and utilities' },
      { name: 'Social', slug: 'social', description: 'Social networking and communication' }
    ];

    for (const categoryData of categories) {
      try {
        await Category.create(categoryData);
        console.log(`✅ Created category: ${categoryData.name}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️ Category already exists: ${categoryData.name}`);
        } else {
          console.log(`❌ Error creating category ${categoryData.name}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Default categories setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up categories:', error);
    process.exit(1);
  }
}

createDefaultCategories();
