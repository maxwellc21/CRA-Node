const Product = require('../models/Product');

exports.seedProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Products already seeded.' });
    }

    const products = [
      {
        name: 'Smart Fitness Watch',
        category: 'Electronics',
        description: 'A smart watch with fitness tracking, heart-rate monitoring, and long battery life.',
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80',
        price: 199.99
      },
      {
        name: 'Premium Coffee Grinder',
        category: 'Home Appliance',
        description: 'A compact grinder for fresh coffee beans with multiple grind settings.',
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
        price: 89.99
      },
      {
        name: 'Online Graphic Design Course',
        category: 'Service',
        description: 'A practical design course that teaches branding, layouts, and digital creativity.',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        price: 49.99
      }
    ];

    await Product.insertMany(products);
    res.status(201).json({ message: 'Products seeded successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
