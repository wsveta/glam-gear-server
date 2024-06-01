const Category = require("../models/categories");
const Product = require("../models/products");
const { addProductSchema, updateProductSchema } = require("../schemas/productSchemas");

const addNewProduct = async (req, res, next) => {
    const { gender, mainCategory, subCategory } = req.body;

    try {
        const product = await addProductSchema.validateAsync(req.body);

        const category = await Category.findOne({
            gender,
            'mainCategory.mainCategory': mainCategory,
            'mainCategory.subCategory.subCategory': subCategory
        }).exec();

        if (!category) {
            return res.status(404).send({ message: "Category doesn't exist" })
        }

        const mc = category.mainCategory.find(mc => mc.mainCategory === mainCategory);

        if (!mc) {
            return res.status(404).send({ message: "Main category doesn't exist" })
        }

        const sc = mc.subCategory.find(sc => sc.subCategory === subCategory);

        if (!sc) {
            return res.status(404).send({ message: "Sub category doesn't exist" })
        }

        const newProduct = await Product.create({ ...product, owner: req.user.id, category: sc._id })

        res.status(200).send(newProduct);
    } catch (error) {
        res.status(401).send({ message: error.message });
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndDelete({ owner: req.user.id, _id: req.params.productId });

        if (product === null) {
            return res.status(404).send({ message: 'Not found' });
        }

        res.status(200).send({ message: 'Product deleted' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

const getProducts = async (req, res, next) => {
    try {
        const results = await Product.find();
        res.status(200).send(results);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (product === null) {
            return res.status(404).send({ message: 'Not found' });
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const product = await updateProductSchema.validateAsync(req.body);
        const updatedProduct = await Product.findOneAndUpdate({ owner: req.user.id, _id: req.params.productId }, product, { new: true });

        if (updatedProduct === null) {
            return res.status(404).send({ message: 'Not found' });
        }
        res.status(200).send(updatedProduct)
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

const sortProducts = async (req, res, next) => {
    try {
        const criteria = req.query.by;
        let sortOptions;

        switch (criteria) {
            case 'newest':
                sortOptions = { dateAdded: -1 }; // Сортувати за датою створення, найновіші першими
                break;
            case 'oldest':
                sortOptions = { dateAdded: 1 }; // Сортувати за датою створення, найстаріші першими
                break;
            case 'expensive':
                sortOptions = { price: -1 }; // Сортувати за ціною, найдорожчі першими
                break;
            case 'cheap':
                sortOptions = { price: 1 }; // Сортувати за ціною, найдешевші першими
                break;
            default:
                sortOptions = {}; // За замовчуванням без сортування
        }
        const products = await Product.find({}).sort(sortOptions);
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
 }

const getProductsByQuery = async (req, res, next) => {
    const query = req.query.q.trim();
    if (!query) {
       return res.status(400).send({ message: "Please enter something" });
    }
    try {
        const result = await Product.find({ name: { $regex: query, $options: 'i' } });

        if (result === null) {
            return res.status(404).send({ message: 'Not found' });
        }
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

module.exports = {
    addNewProduct,
    deleteProduct,
    getProducts,
    getProductById,
    updateProduct,
    getProductsByQuery,
    sortProducts
}