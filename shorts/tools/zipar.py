# Zip the posting folder (videos/images stored, texts deflated); long-path safe on Windows.
import zipfile, os
P = '\\\\?\\'
root = P + os.path.abspath('Ecos_da_Escritura_PARA_POSTAR')
out = P + os.path.abspath('Ecos_da_Escritura_PARA_POSTAR.zip')
with zipfile.ZipFile(out, 'w', allowZip64=True) as z:
    for dp, dn, fn in os.walk(root):
        dn.sort()
        for f in sorted(fn):
            p = os.path.join(dp, f)
            arc = os.path.join('Ecos_da_Escritura_PARA_POSTAR', os.path.relpath(p, root))
            z.write(p, arc, compress_type=zipfile.ZIP_STORED if f.endswith(('.mp4', '.jpg')) else zipfile.ZIP_DEFLATED)
z = zipfile.ZipFile(out)
print(len(z.namelist()), 'files; bad:', z.testzip())
