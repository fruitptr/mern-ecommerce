import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? {name: {$regex: req.query.keyword, $options: 'i'}} : 0;

    const category = req.query.category ? {category: req.query.category} : 0;

    console.log("-------------------");
    console.log(keyword);
    console.log(category);
    console.log("-------------------");

    if (keyword != 0)
    {
        console.log("keyword");
        const count = await Product.countDocuments({...keyword});
        const products = await Product.find({...keyword})
        .limit (pageSize)
        .skip(pageSize * (page - 1));
        res.json({products, page, pages: Math.ceil(count / pageSize)});
        
    }
    else if (category != 0)
    {
        console.log("category");
        const count = await Product.countDocuments({...category});
        const products = await Product.find({...category})
        .limit (pageSize)
        .skip(pageSize * (page - 1));
        res.json({products, page, pages: Math.ceil(count / pageSize)});
        
    }
    else {
        const count = await Product.countDocuments();
        const products = await Product.find()
        .limit (pageSize)
        .skip(pageSize * (page - 1));
        res.json({products, page, pages: Math.ceil(count / pageSize)});
    }
});

// @desc    Fetch a products
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if (product) {
        return res.json(product);
    }
    else {
        res.status(404);
        throw new Error('Resource Not Found');
    }
});

// @desc    Create a products
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/imageplaceholder.png',
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample Description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a products
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    }
    else {
        res.status(404);
        throw new Error('Product Not Found');
    }
});

// @desc    Delete a products
// @route   Delete /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne({_id: product._id});
        res.status(200).json({message: 'Product deleted'});
    }
    else {
        res.status(404);
        throw new Error('Product Not Found');
    }
});

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const {rating, comment} = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
       const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());
       if (alreadyReviewed) {
           res.status(400);
           throw new Error('Product already reviewed');
       }

         const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

            await product.save();

            res.status(201).json({message: 'Review added'});
    }
    else {
        res.status(404);
        throw new Error('Product Not Found');
    }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3);
    res.status(200).json(products);
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts };