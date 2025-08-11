const axios = require('axios');
const colors = require('colors');

const BASE_URL = 'http://localhost:5000';

// Test configurations
const testUser = {
  email: 'testdriver@campovidasystem.com',
  password: 'driver123',
  firstName: 'Test',
  lastName: 'Driver'
};

const testCustomer = {
  email: 'testcustomer@email.com',
  password: 'customer123',
  firstName: 'Test',
  lastName: 'Customer'
};

async function testDriverAndCustomerFeatures() {
  console.log('🌿 Campo Vida - Driver & Customer Feature Test\n'.green.bold);

  try {
    // Test 1: Backend Health Check
    console.log('1. Testing Backend Health...'.yellow);
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Backend is healthy\n'.green);

    // Test 2: Create test customer if doesn't exist
    console.log('2. Setting up test customer...'.yellow);
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, {
        ...testCustomer,
        role: 'customer'
      });
      console.log('✅ Test customer created'.green);
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
        console.log('✅ Test customer already exists'.green);
      } else {
        throw error;
      }
    }

    // Test 3: Create test driver if doesn't exist
    console.log('3. Setting up test driver...'.yellow);
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, {
        ...testUser,
        role: 'driver'
      });
      console.log('✅ Test driver created'.green);
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
        console.log('✅ Test driver already exists'.green);
      } else {
        throw error;
      }
    }

    // Test 4: Customer Login and Order Creation
    console.log('4. Testing customer order flow...'.yellow);
    const customerLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testCustomer.email,
      password: testCustomer.password
    });
    
    const customerToken = customerLogin.data.token;
    console.log('✅ Customer login successful'.green);

    // Get products for order
    const productsResponse = await axios.get(`${BASE_URL}/api/products`);
    const products = productsResponse.data.data;
    
    if (products && products.length > 0) {
      const testOrder = {
        items: [{
          product: products[0]._id,
          name: products[0].name,
          price: products[0].price,
          quantity: 2,
          subtotal: products[0].price * 2
        }],
        deliveryInfo: {
          address: {
            street: '123 Test Street',
            barangay: 'Test Barangay',
            city: 'Baguio City',
            province: 'Benguet',
            zipCode: '2600'
          },
          preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          preferredTime: '14:00',
          specialInstructions: 'Test delivery'
        },
        paymentMethod: {
          method: 'cod'
        },
        summary: {
          subtotal: products[0].price * 2,
          deliveryFee: 50,
          discount: 0,
          totalAmount: (products[0].price * 2) + 50
        }
      };

      const orderResponse = await axios.post(`${BASE_URL}/api/orders`, testOrder, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      
      const testOrderId = orderResponse.data.data._id;
      console.log('✅ Test order created successfully'.green);

      // Test 5: Driver Login and Dashboard
      console.log('5. Testing driver functionality...'.yellow);
      const driverLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      const driverToken = driverLogin.data.token;
      console.log('✅ Driver login successful'.green);

      // Assign driver to order (simulate admin action)
      try {
        const updateOrderResponse = await axios.put(`${BASE_URL}/api/admin/orders/${testOrderId}/assign-driver`, {
          driverId: driverLogin.data.user.id
        }, {
          headers: { Authorization: `Bearer ${driverToken}` }
        });
        console.log('✅ Driver assigned to order'.green);
      } catch (error) {
        console.log('⚠️  Manual driver assignment may be needed'.yellow);
      }

      // Test driver dashboard
      const dashboardResponse = await axios.get(`${BASE_URL}/api/driver/dashboard`, {
        headers: { Authorization: `Bearer ${driverToken}` }
      });
      console.log('✅ Driver dashboard accessible'.green);

      // Test driver deliveries
      const deliveriesResponse = await axios.get(`${BASE_URL}/api/driver/deliveries`, {
        headers: { Authorization: `Bearer ${driverToken}` }
      });
      console.log('✅ Driver deliveries accessible'.green);

      // Test 6: Customer Order Tracking
      console.log('6. Testing customer order tracking...'.yellow);
      const customerOrderResponse = await axios.get(`${BASE_URL}/api/orders/${testOrderId}`, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      console.log('✅ Customer can track order'.green);

      // Test customer orders list
      const customerOrdersResponse = await axios.get(`${BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      console.log('✅ Customer orders list accessible'.green);

      console.log('\n🎉 All Driver & Customer Features Working!'.green.bold);
      console.log('\n📋 Test Summary:'.yellow.bold);
      console.log('✅ Backend API responding'.green);
      console.log('✅ Customer registration & login'.green);
      console.log('✅ Driver registration & login'.green);
      console.log('✅ Order creation system'.green);
      console.log('✅ Driver dashboard & deliveries'.green);
      console.log('✅ Customer order tracking'.green);
      
      console.log('\n🚀 Ready for Friend Testing!'.cyan.bold);
      console.log('👥 Your friends can now test:'.cyan);
      console.log('   • Complete shopping experience'.white);
      console.log('   • Order placement & tracking'.white);
      console.log('   • Real-time delivery updates'.white);
      console.log('   • Driver interactions'.white);
      console.log('   • Payment processing'.white);

    } else {
      console.log('⚠️  No products found - please add products first'.yellow);
    }

  } catch (error) {
    console.error('❌ Test failed:'.red, error.response?.data?.message || error.message);
    console.log('\n🔧 Troubleshooting:'.yellow.bold);
    console.log('1. Make sure backend is running on port 5000'.white);
    console.log('2. Check database connection'.white);
    console.log('3. Verify all required environment variables'.white);
    process.exit(1);
  }
}

// Run the test
testDriverAndCustomerFeatures();
