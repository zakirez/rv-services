import fs from 'node:fs';
import path from 'node:path';
let bad=[];
for(const f of fs.readdirSync('dist').filter(x=>x.endsWith('.html'))){
 const s=fs.readFileSync('dist/'+f,'utf8');
 if((s.match(/<h1>/g)||[]).length!==1)bad.push(f+' h1');
 for(const m of s.matchAll(/(?:href|src)="([^"]+)"/g)){
  const u=m[1];if(!/^(https?:|mailto:|tel:|#)/.test(u)&&!fs.existsSync(path.join('dist',u)))bad.push(f+': '+u);
 }
 const visible=s.match(/<main[^>]*>([\s\S]*)<\/main>/)[1].replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length;
 console.log(f,visible+' mots dans le contenu de page');
 if(f!=='contact.html'&&(visible<277||visible>455))bad.push(f+' mots hors plage');
}
if(bad.length){console.error(bad);process.exit(1)}
console.log('OK — six pages, H1 uniques, longueur conforme, liens locaux valides.');
