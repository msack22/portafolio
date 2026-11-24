# Portafolio · Matías Sack

Portafolio personal de desarrollador Backend y Full Stack. HTML, CSS y JavaScript puros, sin frameworks ni build.

```
index.html        estructura y contenido
css/styles.css    estilos (colores y fuentes en variables al inicio)
js/main.js        tema, menú, contadores, carrusel y formulario
assets/           favicon y CV en PDF
```

## Datos a mantener

- `assets/cv-matias-sack.pdf`: reemplazalo cuando actualices el CV (mismo nombre).
- Certificaciones, formación y cursos: sección `#certificaciones` de `index.html`.
- `js/main.js` → `CONFIG`:
  - `FORMSPREE_ID`: si creás un form gratis en https://formspree.io y pegás el ID, el formulario envía el mail directo; mientras esté vacío abre el cliente de correo hacia `CONTACT_EMAIL`.

## Ver en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicar en GitHub Pages

```bash
git init && git add . && git commit -m "Portafolio inicial"
git branch -M main
git remote add origin https://github.com/msack22/portafolio.git
git push -u origin main
```

En GitHub: **Settings → Pages → Deploy from a branch → main / (root)**.
Queda en `https://msack22.github.io/portafolio/`.

## Agregar un proyecto al carrusel

Copiá un bloque `<article class="slide">` en `index.html` y cambiá textos y links. Los puntos de navegación se generan solos.
Para usar una captura en vez de la portada dibujada, reemplazá el contenido de `.slide__cover` por
`<img src="assets/mi-proyecto.png" alt="..." style="width:100%;height:100%;object-fit:cover">`.
