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

/* ─── LIMITES DE VALIDATION (LOT 2 sécurité) ───────────────────────────────
   Bornes hautes défensives sur les champs texte : au-delà, on considère
   que c'est un bot ou une saisie anormale. Les tailles UI côté form sont
   largement en-dessous. Les vrais utilisateurs ne sont jamais bloqués. */
const MAX_NAME    = 100;   // prénom, nom
const MAX_LINE    = 500;   // type, activite, budget, email, tel
const MAX_MESSAGE = 5000;  // textarea

/* ─── RATE-LIMIT EN MÉMOIRE (LOT 2 sécurité) ───────────────────────────────
   Map IP → timestamps des dernières requêtes. Fenêtre glissante 10 min,
   plafond MAX_REQ_PER_WINDOW = 5 requêtes.

   ⚠️ LIMITE ASSUMÉE : la mémoire d'une fonction serverless Vercel n'est
   PAS partagée entre instances et se réinitialise à chaque cold start.
   Ce rate-limit est "best-effort" — il attrape efficacement les rafales
   sur une même instance chaude (cas 90% du spam), mais un attaquant
   distribué (multi-IPs) ou qui déclenche des cold starts n'est pas bloqué.
   Choix assumé "simple et gratuit sans service externe". Pour du "vrai"
   rate-limit distribué, il faudrait Vercel KV / Upstash Redis (payant). */
const RATE_WINDOW_MS       = 10 * 60 * 1000; // 10 minutes
const MAX_REQ_PER_WINDOW   = 5;
const rateLimitStore       = new Map(); // ip → [ts, ts, ...]

function getClientIp(req) {
  // Vercel expose l'IP réelle via x-forwarded-for (premier IP de la liste)
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim();
  }
  const xreal = req.headers['x-real-ip'];
  if (typeof xreal === 'string' && xreal.length > 0) return xreal.trim();
  return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const history = (rateLimitStore.get(ip) || []).filter((ts) => ts > cutoff);
  if (history.length >= MAX_REQ_PER_WINDOW) {
    return { allowed: false, retryAfter: Math.ceil((history[0] + RATE_WINDOW_MS - now) / 1000) };
  }
  history.push(now);
  rateLimitStore.set(ip, history);
  // Cleanup opportuniste : purger les IPs sans activité récente pour éviter fuite mémoire
  if (rateLimitStore.size > 500) {
    for (const [k, v] of rateLimitStore) {
      if (v.every((ts) => ts <= cutoff)) rateLimitStore.delete(k);
    }
  }
  return { allowed: true };
}

export default async function handler(req, res) {
  // Seul POST accepté
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Rate-limit best-effort (voir doc en tête de fichier)
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ ok: false, error: 'Trop de demandes. Merci de réessayer dans quelques minutes.' });
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

  // Bornes hautes défensives (anti-bot / anti-payload énorme). Tailles largement
  // au-dessus de tout usage humain légitime → aucun vrai utilisateur bloqué.
  if (prenom.length   > MAX_NAME)    errors.push('Prénom trop long.');
  if (nom.length      > MAX_NAME)    errors.push('Nom trop long.');
  if (type.length     > MAX_LINE)    errors.push('Type invalide.');
  if (activite.length > MAX_LINE)    errors.push('Activité trop longue.');
  if (budget.length   > MAX_LINE)    errors.push('Budget invalide.');
  if (email.length    > MAX_LINE)    errors.push('Email trop long.');
  if (tel.length      > MAX_LINE)    errors.push('Téléphone trop long.');
  if (message.length  > MAX_MESSAGE) errors.push('Message trop long.');

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

  // ── Subject normalisé : [DEVIS SK] {activité ou nom} — {type projet} ────────
  // Préfixe constant "[DEVIS SK]" → permet le tri/filtre auto dans Outlook.
  // Priorité : activité (nom d'établissement type "Restaurant Le Gaya")
  // → sinon prénom + nom du client → sinon "Nouvelle demande".
  const clientName  = activite.trim() || [prenom.trim(), nom.trim()].filter(Boolean).join(' ') || 'Nouvelle demande';
  const projectType = type.trim() || 'Projet web';
  const subject     = `[DEVIS SK] ${clientName} — ${projectType}`;

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
        subject,
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
