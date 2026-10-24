const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'database',
  database: process.env.DB_NAME || 'opa',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      "imgUrl" TEXT,
      price NUMERIC(10, 2) NOT NULL
    );
  `);

  const { rows } = await pool.query('SELECT COUNT(*) FROM products');
  if (Number(rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO products (title, description, "imgUrl", price) VALUES
      ('Куртка демисезонная', 'Отличная ветрозащитная куртка для повседневной носки.', 'https://fakestoreapi.com', 2999.00),
      ('Спортивный рюкзак', 'Вместительный рюкзак со множеством карманов и отделением для ноутбука.', 'https://fakestoreapi.com', 1500.50);
    `);
  }
}

async function connectWithRetry(retries = 10, delay = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await initDB();
      console.log('Подключение к PostgreSQL установлено.');
      return;
    } catch (err) {
      console.error(`Попытка ${i}/${retries}: ${err.message}`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  console.error('Не удалось подключиться к БД.');
  process.exit(1);
}

app.get('/product', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY id DESC');
  res.json(rows);
});

app.post('/product', async (req, res) => {
  const { title, description, imgUrl, price } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO products (title, description, "imgUrl", price) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, description, imgUrl, price]
  );
  res.status(201).json(rows[0]);
});

app.put('/product/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, imgUrl, price } = req.body;

  const { rows } = await pool.query(
    'UPDATE products SET title = $1, description = $2, "imgUrl" = $3, price = $4 WHERE id = $5 RETURNING *',
    [title, description, imgUrl, price, id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Товар не найден' });
  }

  res.json(rows[0]);
});

app.delete('/product/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Товар не найден' });
  }

  res.json({ message: 'Товар удалён' });
});

connectWithRetry().then(() => {
  app.listen(PORT, '0.0.0.0', () => console.log(`Сервер на порту ${PORT}`));
});