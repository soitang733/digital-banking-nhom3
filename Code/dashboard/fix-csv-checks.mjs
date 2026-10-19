import fs from 'node:fs';
const file='check-dashboard.mjs';let s=fs.readFileSync(file,'utf8');
const parser=`function csvRecords(input){
 const text=input.replace(/^\\uFEFF/,'');const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(field);field='';}else if((c==='\\r'||c==='\\n')&&!quoted){row.push(field);rows.push(row);row=[];field='';if(c==='\\r'&&text[i+1]==='\\n')i++;}else field+=c;}
 if(quoted)throw Error('Unclosed CSV quote');row.push(field);rows.push(row);return rows;
}
`;
s=s.replace('let capturedCSV=null;', 'let capturedCSV=null;\n'+parser);
s=s.replaceAll("capturedCSV.split('\\r\\n')",'csvRecords(capturedCSV)');
s=s.replace('const parseCSVLine=line=>[...line.matchAll','const parseCSVLine=line=>Array.isArray(line)?line:[...line.matchAll');
fs.writeFileSync(file,s);
