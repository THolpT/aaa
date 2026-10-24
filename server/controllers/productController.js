const pool = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, imgUrl } = req.body;

    const queryText = 'INSERT INTO products (name, price, description, "imgUrl") VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name, price, description, imgUrl];

    const result = await pool.query(queryText, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const queryText = 'DELETE FROM products WHERE id = $1 RETURNING *';

    const result = await pool.query(queryText, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully', deletedProduct: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
