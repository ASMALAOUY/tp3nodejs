import { Router } from 'express';
import { query } from '../config/db.js';
import { body, validationResult } from 'express-validator';

const router = Router();

// Validation pour l'ajout/modification
const validateUser = [
  body('nom').isLength({ min: 2 }).withMessage('Nom trop court').trim(),
  body('prenom').isLength({ min: 2 }).withMessage('Prénom trop court').trim(),
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
];

// GET / – Accueil + liste des utilisateurs
router.get('/', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, nom, prenom, email FROM utilisateurs ORDER BY id DESC LIMIT 10'
    );
    res.render('pages/home', { title: 'Accueil', users: rows, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/home', { 
      title: 'Erreur', 
      users: [], 
      error: 'Erreur de chargement des utilisateurs' 
    });
  }
});

// POST /users – Création
router.post('/users', validateUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { rows } = await query('SELECT * FROM utilisateurs ORDER BY id DESC LIMIT 10');
    return res.status(400).render('pages/home', {
      title: 'Erreur',
      users: rows,
      error: errors.array().map(e => e.msg).join(', ')
    });
  }

  const { nom, prenom, email } = req.body;
  try {
    await query(
      'INSERT INTO utilisateurs (nom, prenom, email) VALUES ($1, $2, $3)',
      [nom, prenom, email]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/home', {
      title: 'Erreur',
      users: [],
      error: 'Échec de la création'
    });
  }
});

// POST /users/:id/edit – Modification
router.post('/users/:id/edit', validateUser, async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array().map(e => e.msg).join(', '));
  }

  try {
    await query(
      'UPDATE utilisateurs SET nom=$1, prenom=$2, email=$3 WHERE id=$4',
      [nom, prenom, email, id]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur de mise à jour');
  }
});

// POST /users/:id/delete – Suppression
router.post('/users/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM utilisateurs WHERE id=$1', [id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur de suppression');
  }
});

export default router;