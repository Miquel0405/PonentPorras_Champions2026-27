# Ponent Porras — Champions League 2026-2027

## Sobre el proyecto

La web oficial de PONENT PORRAS te l'objectiu d'organitzar la porra de la UEFA Champions League de la temporada 2026-2027. L'aplicació permet consultar el calendari i resultats dels partits i seguir la clasificació de la porra de manera diaria.

L'aplicació conta mamb una interficie web feta amb React i una API REST desenvolupada amb Django. Les porres de cada jugador es comparen amb els resultats reals per asignar una quantitat de punts per a cada partit:

- **3 punts** per encertar el resultat exacte (També conegut com fer un PLENO).
- **2 punts** per encertar la diferencia de gols (DDG).
- **1 punt** per encertar el signe del resultat 1x2 (victoria local, empat o victoria visitant).
- **0 punts** si no s'encerta cap de les anteriors.

**Nota**: tot i endevinar la diferencia de gols (0), encertar un empat diferent al del resultat real equival a un encert del tipus 1x2 i per tant val 1 punt. 

La web inclou una pàgina de inici amb un resum de la classificació així com els pròxims partits, una pàgines dedicades a la classificació detallada i al calendari complet de partit i pantalles per editar pronòstics (porres) i resultats.

## Tecnologies

- **Frontend:** React, Vite, React Router, Axios i components de Material UI. Recharts s'utilitza per a les gràfiques.
- **Backend:** Python, Django i Django REST Framework; la API utilitza autenticació JWT.
- **Persistència:** basse de dades configurada mitjançant la variable d'entorn `DATABASE_URL`.

## Estructura del codi

### `frontend/`

Aplicació React i configuració de Vite.

- `src/main.jsx` i `src/App.jsx`: punt d'entrada.
- `src/routes/`: rutes i pàgines disponibles a l'aplicació.
- `src/pages/`: vistes completes de l'inicio, la classificació, partitss, participants i formularis d'edició.
- `src/components/`: elements reutilitzables per a classificacions, participants, partits i pronòstics.
- `src/layouts/`: estructura compartida, capcelera i navegació lateral.
- `src/api/`: HTTP a la API del backend.
- `src/styles/`: variables, estils globals i estils de composició.
- `src/assets/` i `public/`: recursos gràfics y estàtics.
- `package.json`: dependències i comandaments de desenvolupament, compilació i lint.

### `backend/`

Projecte Django que exposa la API i gestiona les dades i les regles de puntuació.

- `config/`: configuració de Django i rutes generals del projecte.
- `core/models/`: models d'equips, participants, partits i pronòstics.
- `core/serializers/`: conversió i validació de dades per a les respostes i peticions de la API.
- `core/views/`: endpoints de consulta i edició.
- `core/services/`: lògica per a actualitzar pronòstics i resultats, calcular punts i henerar la classificació.
- `core/urls.py`: rutes de la API sota `/api/`.
- `core/permissions.py`: permissos utilitzats per les vistes.
- `core/migrations/`: historial de cambios del esquema de la base de datos.
- `core/tests.py`: tests de l'aplicació.
- `manage.py`: comandaments d'administració de Django.
- `requirements.txt`: dependències de Python.
- `build.sh`: instalació de dependències i recopilació d'arxius estàtics per a la compilació del backend.

## Desenvolupament local

Es necesita Python, Node.js i npm. Configura les variables de entorn abans d'iniciar els servidors:

- A `backend/.env`, defineix `SECRET_KEY` i `DATABASE_URL`. També es pot configurar `DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` i `DJANGO_ENV`.
- A `frontend/.env.local`, defineix `VITE_API_URL` amb la URL base del servidor backend, per exemple `http://localhost:8000`.

No incloguis claus no credencials reals dins el repositori.

Inicia el backend desde una terminal:

```bash
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Inicia el frontend desde una altra terminal:

```bash
cd frontend
npm ci
npm run dev
```

Per a comprobar el projecte, desde `frontend/` es pot ejecutar `npm run lint` i `npm run build`; desde `backend/`, `python manage.py test`.
