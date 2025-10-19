const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_KEY,
  },
});

// GET /api/profile - Get current user profile
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// PUT /api/profile - Update user profile
router.put('/', authenticate, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bio,
      location,
      website,
      currentPassword,
      newPassword,
      avatar
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate current password if changing password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const saltRounds = 10;
      user.password = await bcrypt.hash(newPassword, saltRounds);
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (website) user.website = website;
    if (avatar) user.avatar = avatar;

    await user.save();

    // Remove password from response
    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/profile/upload-url - Get presigned URL for profile image upload
router.post('/upload-url', authenticate, async (req, res) => {
  try {
    const { filename, contentType } = req.body;

    if (!filename || !contentType) {
      return res.status(400).json({ error: 'Filename and content type are required' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({ error: 'Invalid file type. Only images are allowed.' });
    }

    // Generate unique filename
    const fileExtension = filename.split('.').pop();
    const uniqueFilename = `profile-images/${req.user.id}/${uuidv4()}.${fileExtension}`;

    // Create presigned URL
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME,
      Key: uniqueFilename,
      ContentType: contentType,
      ACL: 'public-read',
      Metadata: {
        userId: req.user.id,
        uploadType: 'profile-image'
      }
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes
    const bucket = process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME;
    const fileUrl = `https://${bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${uniqueFilename}`;

    res.json({
      success: true,
      uploadUrl,
      fileUrl,
      key: uniqueFilename
    });

  } catch (error) {
    console.error('Get upload URL error:', error);
    res.status(500).json({ error: 'Failed to get upload URL' });
  }
});

// DELETE /api/profile/avatar - Delete profile avatar
router.delete('/avatar', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete from S3 if avatar exists
    if (user.avatar && user.avatar.includes('amazonaws.com')) {
      const avatarKey = user.avatar.split('.amazonaws.com/')[1];
      
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME,
        Key: avatarKey,
      });

      await s3Client.send(deleteCommand);
    }

    // Remove avatar from user record
    user.avatar = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar deleted successfully'
    });

  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({ error: 'Failed to delete avatar' });
  }
});

// DELETE /api/profile - Delete user account
router.delete('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete avatar from S3 if exists
    if (user.avatar && user.avatar.includes('amazonaws.com')) {
      const avatarKey = user.avatar.split('.amazonaws.com/')[1];
      
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME,
        Key: avatarKey,
      });

      await s3Client.send(deleteCommand);
    }

    // Delete user account
    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
