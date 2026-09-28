# -*- coding: utf-8 -*-
"""Gera js/mapa-geo.js a partir de ferramentas/mapa_geo_src.py.
Uso: python3 ferramentas/gerar_mapa.py

Monta a geometria do mapa (arcos compartilhados entre países vizinhos),
suaviza as linhas, projeta em Mercator e grava o resultado em js/mapa-geo.js."""
import json, math, sys
from mapa_geo_src import ARC, ISL, COUNTRIES

LON0, LON1, LAT0, LAT1 = 67.0, 147.0, -11.0, 46.0
W = 1000.0


def merc(lat):
    return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))


K = W / (LON1 - LON0)
YTOP = merc(LAT1)
H = (YTOP - merc(LAT0)) * K


def proj(p):
    lon, lat = p
    return ((lon - LON0) * K, (YTOP - merc(lat)) * K)


def chaikin_open(pts, it=2):
    for _ in range(it):
        if len(pts) < 3:
            return pts
        out = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]):
            out.append((0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]))
            out.append((0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]))
        out.append(pts[-1])
        # remove duplicados junto das pontas
        pts = out
    return pts


def chaikin_closed(pts, it=2):
    for _ in range(it):
        out = []
        n = len(pts)
        for i in range(n):
            a, b = pts[i], pts[(i + 1) % n]
            out.append((0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]))
            out.append((0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]))
        pts = out
    return pts


# arcos: nós fixos, sem suavizar muito as fronteiras retas curtas
SM = {k: chaikin_open([tuple(p) for p in v], 2) for k, v in ARC.items()}


def close(a, b, tol=1e-6):
    return abs(a[0] - b[0]) < tol and abs(a[1] - b[1]) < tol


def assemble(names, cname):
    ring = []
    for nm in names:
        seg = list(SM[nm])
        if not ring:
            ring = seg
            continue
        end = ring[-1]
        if close(end, seg[0]):
            ring += seg[1:]
        elif close(end, seg[-1]):
            ring += list(reversed(seg))[1:]
        elif close(ring[0], seg[0]) and len(ring) == len(SM[names[0]]):
            # primeiro arco estava invertido
            ring = list(reversed(ring))
            if close(ring[-1], seg[0]):
                ring += seg[1:]
            else:
                raise SystemExit(f'{cname}: {nm} não conecta')
        elif close(ring[0], seg[-1]) and len(ring) == len(SM[names[0]]):
            ring = list(reversed(ring))
            ring += list(reversed(seg))[1:]
        else:
            raise SystemExit(f'{cname}: arco {nm} não conecta ({end} vs {seg[0]}/{seg[-1]})')
    if not close(ring[0], ring[-1]):
        raise SystemExit(f'{cname}: anel não fecha {ring[0]} {ring[-1]}')
    return ring[:-1]


def path_of(rings):
    parts = []
    for r in rings:
        pp = [proj(p) for p in r]
        s = 'M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pp) + 'Z'
        parts.append(s)
    return ''.join(parts)


def area(r):
    a = 0
    for i in range(len(r)):
        x1, y1 = r[i]
        x2, y2 = r[(i + 1) % len(r)]
        a += x1 * y2 - x2 * y1
    return a / 2


def centroid(r):
    a = area(r)
    cx = cy = 0
    for i in range(len(r)):
        x1, y1 = r[i]
        x2, y2 = r[(i + 1) % len(r)]
        f = x1 * y2 - x2 * y1
        cx += (x1 + x2) * f
        cy += (y1 + y2) * f
    return (cx / (6 * a), cy / (6 * a)) if a else r[0]


out = {}
for c, rings_def in COUNTRIES.items():
    rings = []
    for rd in rings_def:
        if isinstance(rd, str) and rd.startswith('ISL:'):
            nm = rd[4:]
            rings.append(chaikin_closed([tuple(p) for p in ISL[nm]], 2))
        else:
            rings.append(assemble(rd, c))
    prj = [[proj(p) for p in r] for r in rings]
    big = max(prj, key=lambda r: abs(area(r)))
    out[c] = dict(d=path_of(rings), c=[round(v, 1) for v in centroid(big)])

meta = dict(W=W, H=round(H, 1), lon0=LON0, lon1=LON1, lat0=LAT0, lat1=LAT1, K=K, ytop=YTOP)

# linhas de referência
def lat_line(lat):
    y = proj((LON0, lat))[1]
    return round(y, 1)

meta['tropico'] = lat_line(23.44)
meta['equador'] = lat_line(0.0)

if __name__ == '__main__':
    js = 'window.MAPA_GEO = ' + json.dumps(dict(meta=meta, paises=out), ensure_ascii=False,
                                           separators=(',', ':')) + ';\n'
    import os
    destino = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'js', 'mapa-geo.js')
    open(destino, 'w', encoding='utf-8').write(js)
    print('ok', len(js), 'bytes', meta)
