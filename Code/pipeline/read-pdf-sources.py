from pathlib import Path
import hashlib
import json
import pymupdf as fitz

ROOT=Path(__file__).resolve().parents[1]
destination=ROOT/'pipeline/data/pdf-fresh'
destination.mkdir(exist_ok=True)
manifest=json.loads((ROOT/'pipeline/data/reports/manifest.json').read_text(encoding='utf-8-sig'))
results=[]
for report in manifest:
    pdf=Path(report['file'])
    assert pdf.exists(),pdf
    digest=hashlib.sha256(pdf.read_bytes()).hexdigest()
    assert digest.lower()==report['sha256'].lower(),report['id']+' changed PDF'
    with fitz.open(pdf) as document:
        pages=[{'page':i+1,'text':page.get_text('text',sort=True)} for i,page in enumerate(document)]
    result={'id':report['id'],'bank':report['bank'],'year':report['year'],'type':report['type'],'url':report['url'].replace('\\u0026','&'),'sha256':digest,'pages':pages}
    (destination/(report['id']+'.json')).write_text(json.dumps(result,ensure_ascii=False),encoding='utf-8')
    results.append({'id':report['id'],'bank':report['bank'],'year':report['year'],'pages':len(pages),'pages_with_text':sum(len(p['text'].strip())>40 for p in pages)})
    print(report['id'],report['bank'],report['year'],'pages:',len(pages),flush=True)
(destination/'manifest.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pdfs_opened':len(results),'pages_read':sum(r['pages'] for r in results)},ensure_ascii=False))
