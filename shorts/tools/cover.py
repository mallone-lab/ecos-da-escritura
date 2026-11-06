# Thumbnail from a painted frame: darkened edge, big serif title (one word in gold), small channel mark.
# python cover.py frame.png out.jpg WxH "LINE ONE|*GOLD LINE*|small line" [--left]
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src, out, size, text = sys.argv[1:5]; left = '--left' in sys.argv
W, H = map(int, size.split('x'))
FONT = __import__('os').path.join(__import__('os').path.dirname(__file__), '..', 'fonts', 'CormorantGaramond.ttf')
im = Image.open(src).convert('RGB')
arg = lambda k, d: float(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else d
z, fx, fy, at = arg('--zoom', 1), arg('--fx', .5), arg('--fy', .5), arg('--at', .5)
s = max(W / im.width, H / im.height) * z; im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
ox = int(min(max(fx * im.width - at * W, 0), im.width - W)); oy = int(min(max(fy * im.height - .5 * H, 0), im.height - H)); im = im.crop((ox, oy, ox + W, oy + H))
shade = Image.new('L', (W, H), 0); d = ImageDraw.Draw(shade)
if left: d.rectangle([0, 0, int(W * .55), H], fill=170)
else: d.rectangle([0, 0, W, int(H * .36)], fill=160)
shade = shade.filter(ImageFilter.GaussianBlur(W * .08)); im = Image.composite(Image.new('RGB', (W, H), (8, 6, 4)), im, shade)
dr = ImageDraw.Draw(im)
def font(px, w=700):
    f = ImageFont.truetype(FONT, px)
    try: f.set_variation_by_axes([w])
    except Exception: pass
    return f
lines = text.split('|'); y = int(H * (.12 if not left else .2)); x0 = int(W * .06)
for ln in lines:
    small = ln.startswith('~'); gold = ln.startswith('*')
    t = ln.strip('*~'); px = int((H * .075 if small else H * .15) if left else (W * .07 if small else W * .13))
    f = font(px, 600 if small else 700)
    while dr.textlength(t, font=f) > W * (.5 if left else .9) and px > 20: px -= 4; f = font(px, 600 if small else 700)
    tw = dr.textlength(t, font=f); x = x0 if left else (W - tw) / 2
    col = (242, 196, 90) if gold else ((240, 220, 176) if small else (251, 241, 216))
    for dx, dy in [(0, 6), (3, 3), (-3, 3)]: dr.text((x + dx, y + dy), t, font=f, fill=(0, 0, 0))
    dr.text((x, y), t, font=f, fill=col); y += int(px * 1.02) + (10 if small else 0)
fm = font(int(H * .03 if left else W * .032), 600); mark = 'ECOS DA ESCRITURA'
dr.text(((x0) if left else (W - dr.textlength(mark, font=fm)) / 2, H - int(H * .08)), mark, font=fm, fill=(243, 230, 200))
im.save(out, quality=92); print(out, W, H)
