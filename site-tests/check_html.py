#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from collections import Counter

class Audit(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids=[]
        self.symbols=[]
        self.uses=[]
        self.images=[]
        self.h1=0
        self.bad_links=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if 'id' in d: self.ids.append(d['id'])
        if tag=='symbol' and 'id' in d:self.symbols.append(d['id'])
        if tag=='use' and d.get('href','').startswith('#'):self.uses.append(d['href'][1:])
        if tag=='h1':self.h1+=1
        if tag=='img' and 'alt' not in d:self.images.append(d.get('src','?'))
        if tag=='a' and d.get('target')=='_blank' and 'noopener' not in d.get('rel',''):self.bad_links.append(d.get('href','?'))

html=Path("docs/index.html").read_text(encoding="utf-8")
css=Path("docs/styles.css").read_text(encoding="utf-8")
audit=Audit()
audit.feed(html)
assert audit.h1==1
assert len(audit.ids)==len(set(audit.ids)),[x for x,n in Counter(audit.ids).items() if n>1]
assert not audit.images, "Missing alt on image(s): " + str(audit.images)
assert not audit.bad_links, "Missing noopener on external links: " + str(audit.bad_links)
assert not set(audit.uses)-set(audit.symbols), "Undefined SVG icons: " + str(set(audit.uses)-set(audit.symbols))
assert '3.6.0' in html and 'winmail.dat' in html
assert 'versión pública' in html and 'no necesita firma ATN' in html
assert 'releases/download/v3.6.0/lookout-mily-3.6.0.xpi' in html
assert 'prefers-reduced-motion' in css and 'max-width: 600px' in css
assert 'www.google-analytics.com' not in html and '<script' not in html
print('PASS semantic HTML, '+str(len(audit.ids))+' unique IDs, '+str(len(audit.uses))+' SVG icon uses, accessibility and honest release labels')
