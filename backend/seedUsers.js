const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB for seeding...');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@campo-vida.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      await mongoose.disconnect();
      return;
    }

    // Create admin user - matching exact model requirements
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'Campo Vida',
      email: 'admin@campo-vida.com',
      phone: '09709813882',
      password: 'password123',
      role: 'admin',
      address: {
        street: 'W2Q7+4J, Malagutay',
        barangay: 'Malagutay',
        city: 'Zamboanga City',
        province: 'Zamboanga del Sur',
        zipCode: '7000' // Note: zipCode not postalCode
      },
      isEmailVerified: true,
      codEligible: true,
      successfulGCashOrders: 10,
      preferences: {
        notifications: {
          email: true,
          sms: true,
          orderUpdates: true,
          promotions: true
        },
        deliveryPreference: 'delivery'
      },
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');

    // Create demo customer user
    const customerUser = new User({
      firstName: 'Demo',
      lastName: 'Customer',
      email: 'customer@campo-vida.com',
      phone: '09123456789',
      password: 'password123',
      role: 'customer',
      address: {
        street: 'Sample Street 123',
        barangay: 'Sample Barangay',
        city: 'Zamboanga City',
        province: 'Zamboanga del Sur',
        zipCode: '7000'
      },
      isEmailVerified: true,
      codEligible: true,
      successfulGCashOrders: 5,
      preferences: {
        notifications: {
          email: true,
          sms: false,
          orderUpdates: true,
          promotions: false
        },
        deliveryPreference: 'delivery'
      },
      isActive: true
    });

    await customerUser.save();
    console.log('✅ Demo customer user created successfully!');

    // Create demo driver user
    const driverUser = new User({
      firstName: 'Demo',
      lastName: 'Driver',
      email: 'driver@campo-vida.com',
      phone: '09987654321',
      password: 'password123',
      role: 'driver',
      address: {
        street: 'Driver Street 456',
        barangay: 'Driver Barangay',
        city: 'Zamboanga City',
        province: 'Zamboanga del Sur',
        zipCode: '7000'
      },
      isEmailVerified: true,
      codEligible: false,
      successfulGCashOrders: 0,
      preferences: {
        notifications: {
          email: true,
          sms: true,
          orderUpdates: true,
          promotions: false
        },
        deliveryPreference: 'delivery'
      },
      driverInfo: {
        licenseNumber: 'D12345678',
        vehicleType: 'Motorcycle',
        vehiclePlateNumber: 'ABC-1234',
        isAvailable: true,
        deliveryRadius: 15,
        totalDeliveries: 0,
        rating: 5.0
      },
      isActive: true
    });

    await driverUser.save();
    console.log('✅ Demo driver user created successfully!');

    console.log('\n🎉 All demo users created successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('👤 Admin: admin@campo-vida.com / password123');
    console.log('👤 Customer: customer@campo-vida.com / password123');
    console.log('👤 Driver: driver@campo-vida.com / password123');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    if (error.errors) {
      console.error('Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeding function
seedUsers();
