/**
 * api/lead.js — Serverless function Vercel
 * Reçoit le payload du formulaire de devis et envoie un email via Resend.
 *
 * Variables d'environnement requises :
 *   RESEND_API_KEY  — clé API Resend (jamais côté client)
 *
 * Sécurité :
 *   - Validation serveur stricte de tous les champs
 *   - Honeypot anti-spam (champ "website" doit rester vide)
 *   - Seule la méthode POST est acceptée
 *   - Aucun secret exposé dans la réponse
 */

const DEST_EMAIL = 'sk.agence@outlook.fr';
const FROM_EMAIL = 'SK Agence <contact@skagence.fr>'; // domaine skagence.fr vérifié dans Resend
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  // Seul POST accepté
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Clé API présente ?
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[lead] RESEND_API_KEY manquante');
    return res.status(500).json({ ok: false, error: 'Configuration serveur incomplète.' });
  }

  // Parsing du body
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ ok: false, error: 'Payload JSON invalide.' });
  }

  const {
    prenom = '',
    nom = '',
    type = '',
    activite = '',
    message = '',
    budget = '',
    contact_type = '',
    email = '',
    tel = '',
    consent,
    website = '', // honeypot — doit rester vide
  } = body;

  // ── Honeypot anti-spam ──────────────────────────────────────────────────────
  if (website.trim() !== '') {
    // Répondre OK pour ne pas avertir les bots
    return res.status(200).json({ ok: true });
  }

  // ── Validation serveur ──────────────────────────────────────────────────────
  const errors = [];

  if (!prenom.trim()) errors.push('Prénom requis.');
  if (!nom.trim()) errors.push('Nom requis.');
  if (!type.trim()) errors.push('Type de site requis.');
  if (!activite.trim()) errors.push('Activité requise.');
  if (!message.trim()) errors.push('Message requis.');
  if (!budget.trim()) errors.push('Budget requis.');

  if (contact_type === 'email') {
    if (!email.trim()) {
      errors.push('Email requis.');
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.push('Format email invalide.');
    }
  } else if (contact_type === 'tel') {
    const digits = tel.replace(/\D/g, '');
    if (digits.length < 8) errors.push('Numéro de téléphone invalide.');
  } else {
    errors.push('Mode de contact invalide.');
  }

  if (consent !== true && consent !== 'true') {
    errors.push('Consentement RGPD requis.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, error: errors.join(' ') });
  }

  // ── Construction de l'email ─────────────────────────────────────────────────
  const contactLine =
    contact_type === 'email'
      ? `Email : ${email.trim()}`
      : `Téléphone : ${tel.trim()}`;

  const emailText = `
Nouveau lead — formulaire de devis SK Agence
=============================================

Prénom      : ${prenom.trim()}
Nom         : ${nom.trim()}
Type de site: ${type.trim()}
Activité    : ${activite.trim()}
Budget      : ${budget.trim()}
${contactLine}

Message
-------
${message.trim()}

---
Reçu le ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
`.trim();

  // ── Envoi via Resend ────────────────────────────────────────────────────────
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [DEST_EMAIL],
        subject: `[SK Agence] Nouveau lead — ${prenom.trim()} ${nom.trim()}`,
        text: emailText,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('[lead] Resend error:', response.status, detail);
      return res.status(502).json({ ok: false, error: 'Erreur lors de l\'envoi. Réessayez dans un instant.' });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('[lead] fetch error:', err);
    return res.status(502).json({ ok: false, error: 'Erreur réseau. Réessayez dans un instant.' });
  }
}
