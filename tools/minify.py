import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]

# Helper minifiers (simple but practical for this repo)
def minify_css(text: str) -> str:
    # remove comments
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
    # collapse whitespace
    text = re.sub(r'\s+', ' ', text)
    # remove space around symbols
    text = re.sub(r'\s*([{}:;,>+\(\)])\s*', r'\1', text)
    return text.strip()

def minify_js(text: str) -> str:
    # remove block comments
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
    # remove line comments (naive)
    text = re.sub(r'//.*(?=[\n\r])', '', text)
    # collapse whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# Files to process
css_in = root / 'css' / 'style.css'
css_out = root / 'css' / 'style.min.css'
js_in = root / 'main.js'
js_out_root = root / 'main.min.js'
js_out_jsdir = root / 'js' / 'main.min.js'

# Read and write
if css_in.exists():
    s = css_in.read_text(encoding='utf-8')
    css_min = minify_css(s)
    css_out.write_text(css_min, encoding='utf-8')
    print('Wrote', css_out)
else:
    print('Missing', css_in)

if js_in.exists():
    s = js_in.read_text(encoding='utf-8')
    js_min = minify_js(s)
    js_out_root.write_text(js_min, encoding='utf-8')
    print('Wrote', js_out_root)
    try:
        js_out_jsdir.write_text(js_min, encoding='utf-8')
        print('Wrote', js_out_jsdir)
    except Exception as e:
        print('Could not write to js dir:', e)
else:
    print('Missing', js_in)
