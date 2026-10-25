import { OAuth2Client } from 'google-auth-library';
import { get, put } from '@vercel/blob';
import { GROUPS, ITEMS } from '../lib/checklist.js';
const owners = () => new Set((process.env.OWNER_EMAILS || '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean));
const google = new OAuth2Client();
export function isOwner(payload) {
  return payload?.email_verified === true && owners().has(payload.email?.toLowerCase());
}
export async function authenticate(req) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token || !process.env.GOOGLE_CLIENT_ID) return false;
  try {
    const ticket = await google.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    return isOwner(ticket.getPayload());
  } catch { return false; }
}
export function validUpdate(body) {
  return body && Object.keys(body).length === 2 && ITEMS.includes(body.id) && typeof body.done === 'boolean';
}
async function readChecks() {
  const pairs = await Promise.all(ITEMS.map(async (id, i) => {
    const file = await get(`checklist/v1/${i}.json`, { access: 'private', useCache: false });
    if (!file) return [id, false];
    if (file.statusCode !== 200) throw new Error('Storage read failed');
    const value = await new Response(file.stream).json();
    if (typeof value.done !== 'boolean') throw new Error('Invalid saved state');
    return [id, value.done];
  }));
  return Object.fromEntries(pairs);
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET','PATCH'].includes(req.method)) { res.setHeader('Allow','GET, PATCH'); return res.status(405).end(); }
  if (req.method === 'PATCH' && !(await authenticate(req))) return res.status(403).json({error:'Owner sign-in required.'});
  const configured = !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
  if (!configured) return res.status(503).json({error:'Shared progress is not configured.',clientId:process.env.GOOGLE_CLIENT_ID || null});
  try {
    if (req.method === 'PATCH') {
      if (!validUpdate(req.body)) return res.status(400).json({error:'Invalid checklist update.'});
      const index = ITEMS.indexOf(req.body.id);
      await put(`checklist/v1/${index}.json`, JSON.stringify({done:req.body.done}), {access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json',cacheControlMaxAge:60});
    }
    const owner = await authenticate(req);
    const checks = await readChecks();
    const done = Object.values(checks).filter(Boolean).length;
    return res.status(200).json({done,total:ITEMS.length,owner,clientId:process.env.GOOGLE_CLIENT_ID || null,...(owner ? {checks,groups:GROUPS} : {})});
  } catch {
    return res.status(503).json({error:'Progress could not be saved or loaded. Please retry.'});
  }
}
