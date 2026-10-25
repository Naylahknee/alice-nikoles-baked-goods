import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('public', {recursive:true});
for(const file of ['index.html','dc-runtime.js','cookie-animation.js','cookie-animation.css','owner-access.js','Alice-Nikole-Business-Plan.html','Alice-Nikole-Pitch-Deck.html']) await copyFile(file, `public/${file}`);
