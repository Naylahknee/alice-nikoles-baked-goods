import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import handler, {isOwner,validUpdate} from '../api/progress.js';
import {ITEMS} from '../lib/checklist.js';
test('only the two verified configured owner accounts qualify',()=>{
 const old=process.env.OWNER_EMAILS; process.env.OWNER_EMAILS='owner-one@example.com,owner-two@example.com';
 for(const email of ['owner-one@example.com','owner-two@example.com']) assert.equal(isOwner({email,email_verified:true}),true);
 for(const p of [{email:'owner-one@example.com'}, {email:'owner-one@example.com',email_verified:false},{email:'someone@gmail.com',email_verified:true},{}]) assert.equal(isOwner(p),false);
 if(old===undefined) delete process.env.OWNER_EMAILS; else process.env.OWNER_EMAILS=old;
});
test('updates accept one known checkbox and a boolean only',()=>{
 assert.equal(ITEMS.length,21);
 assert.ok(validUpdate({id:ITEMS[0],done:true}));
 for(const b of [{id:'fake',done:true},{id:ITEMS[0],done:'true'},{id:ITEMS[0],done:true,owner:true}]) assert.equal(validUpdate(b),false);
});
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(v){this.body=v;return this},end(){return this}}}
test('anonymous or forged writes are rejected before storage access',async()=>{
 for(const headers of [{},{authorization:'Bearer fake'}]) {const res=response();await handler({method:'PATCH',headers,body:{id:ITEMS[0],done:true}},res);assert.equal(res.code,403);assert.equal(res.headers['Cache-Control'],'private, no-store');}
});
test('missing configuration fails closed without exposing checklist',async()=>{
 const previous=process.env.BLOB_READ_WRITE_TOKEN; const store=process.env.BLOB_STORE_ID;delete process.env.BLOB_READ_WRITE_TOKEN;delete process.env.BLOB_STORE_ID;
 try{const res=response();await handler({method:'GET',headers:{}},res);assert.equal(res.code,503);assert.equal(res.body.groups,undefined);assert.equal(res.body.checks,undefined);}finally{if(previous)process.env.BLOB_READ_WRITE_TOKEN=previous;if(store)process.env.BLOB_STORE_ID=store;}
});
test('all 22 animation states render, with distinct ingredient forms',()=>{
 const window={React:{createElement:(tag,props,...kids)=>({tag,props,kids})}};
 vm.runInNewContext(readFileSync('cookie-animation.js','utf8'),{window});
 const outputs=[];
 for(let d=0;d<=21;d++){const svg=window.CookieBake.scene(d);assert.equal(svg.tag,'svg');assert.equal(svg.props['aria-label'],window.CookieBake.caption(d));outputs.push(JSON.stringify(svg));}
 assert.ok(outputs[1].includes('flour-puff'));assert.ok(outputs[6].includes('rect'));assert.ok(outputs[7].includes('vanilla-stream'));assert.ok(outputs[9].includes('mixing-whisk'));assert.ok(outputs[10].includes('oven-heat'));assert.ok(outputs[21].includes('Every last bite!'));
 assert.equal(new Set(outputs).size,22);
});
test('public bundle contains no checklist labels or owner addresses',()=>{
 const html=readFileSync('index.html','utf8');
 for(const value of [ITEMS[0],'owner-one@example.com','owner-two@example.com']) assert.equal(html.includes(value),false);
});
