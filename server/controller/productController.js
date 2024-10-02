import Product from "../model/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = req.query.search
      ? await Product.find({
          productName: { $regex: req.query.search, $options: "i" },
        })
      : await Product.find();

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = req.body;

    const newProduct = new Product(product);

    await newProduct.save();

    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    existingProduct.productName =
      product.productName || existingProduct.productName;
    existingProduct.category = product.category || existingProduct.category;
    existingProduct.quantity = product.quantity || existingProduct.quantity;
    existingProduct.price = product.price || existingProduct.price;
    existingProduct.processor = product.processor || existingProduct.processor;
    existingProduct.os = product.os || existingProduct.os;
    existingProduct.graphics = product.graphics || existingProduct.graphics;
    existingProduct.storage = product.storage || existingProduct.storage;
    existingProduct.image = product.image || existingProduct.image;

    if (existingProduct.promotion) {
      existingProduct.promotion = false;
    } else {
      existingProduct.promotion = true;
    }
    existingProduct.discount = product.discount || existingProduct.discount;
    existingProduct.ratting = product.ratting || existingProduct.ratting;

    const updatedProduct = await existingProduct.save();

    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
