const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });

        const users = await User.bulkCreate(userData, {
            individualHooks: true,
            returning: true,
        });

        const posts = await Promise.all(postData.map(async post => {
            return await Post.create({
                ...post,
                user_id: users[Math.floor(Math.random() * users.length)].id,
            });
        }));

        await Promise.all(commentData.map(async comment => {
            return await Comment.create({
                ...comment,
                user_id: users[Math.floor(Math.random() * users.length)].id,
                post_id: posts[Math.floor(Math.random() * posts.length)].id, 
            });
        }));

        console.log('Your database has been seeded successfully.');
    } catch (err) {
        console.error('Sorry bra, there was an error seeding your database, my b:', err);
    } finally {
        process.exit(0);
    }
};


seedDatabase();