# Package the production pipeline as a git repo folder: ecos-da-escritura/ (source only, no renders/audio/videos).
import os, shutil
P = '\\\\?\\'
HERE = os.path.abspath(os.getcwd())
SRC_S, SRC_J = os.path.join(HERE, 'shorts'), os.path.join(HERE, 'jonas')
OUT = os.path.join(HERE, 'ecos-da-escritura')
LIB_LICENSE = os.path.expanduser('~/lemo-opuscar/LICENSE')
if os.path.exists(P + OUT): shutil.rmtree(P + OUT)
SKIP_DIRS = {'out', 'review', 'voice', 'stills', 'strips', 'vstills', 'capas', '__pycache__', '.cache'}
SKIP_EXT = ('.mp4', '.wav', '.jpg', '.png', '.zip', '.srt', '.log')
def copytree(src, dst):
    for dp, dn, fn in os.walk(P + src):
        dn[:] = [d for d in dn if d not in SKIP_DIRS]
        rel = os.path.relpath(dp, P + src)
        tgt = os.path.normpath(os.path.join(dst, rel)); os.makedirs(P + tgt, exist_ok=True)
        for f in fn:
            if f.endswith(SKIP_EXT): continue
            shutil.copy2(os.path.join(dp, f), P + os.path.join(tgt, f))
copytree(SRC_S, os.path.join(OUT, 'shorts'))
copytree(SRC_J, os.path.join(OUT, 'jonas'))
if os.path.exists(LIB_LICENSE): shutil.copy2(LIB_LICENSE, P + os.path.join(OUT, 'shorts', 'engine', 'LICENSE-LemoLab-MIT.txt')); shutil.copy2(LIB_LICENSE, P + os.path.join(OUT, 'jonas', 'engine', 'LICENSE-LemoLab-MIT.txt'))
n = sum(len(fn) for _, _, fn in os.walk(P + OUT))
size = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fn in os.walk(P + OUT) for f in fn)
print('files', n, 'MB', round(size / 1e6, 1))
