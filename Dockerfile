FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
RUN npm run build

FROM python:3.12-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl nodejs npm && rm -rf /var/lib/apt/lists/*

COPY backend/pyproject.toml backend/README.md ./backend/
COPY backend/src/ ./backend/src/
COPY backend/main.py ./backend/
RUN pip install --no-cache-dir ./backend

COPY --from=frontend-builder /app/frontend ./frontend

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 8000 3000

CMD ["./entrypoint.sh"]
