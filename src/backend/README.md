# Backend (Gin + Swagger)

## Подготовка окружения

Перед запуском необходимо создать файл .env с переменными окружения.

Скопируйте пример конфигурации командой

    cp .env.example .env

При необходимости отредактируйте значения.


## Запуск Gin сервера и инфраструктуры

    docker compose up --build

После запуска будут подняты:
- Backend (Gin сервер)
- PostgreSQL
- MinIO
- ML-сервис
- Frontend

Миграции базы данных и начальные данные будут автоматически применены при первом запуске.

Backend будет доступен на http://localhost:8080


## Локальный запуск Gin сервера

    go run cmd/server/main.go

Сервер будет слушать на http://localhost:8080


## Миграции базы данных

### Автоматические миграции (Docker Compose)

При `docker compose up` автоматически применяются миграции:
- Запускается контейнер `migrate` (смотри Dockerfile.migrate)
- Миграции применяются через `psql` к базе данных `postgres://${POSTGRES_USER}@postgres:5432/${POSTGRES_DB}`

Для ручного выполнения в Docker:

    docker compose up migrate

Для ручного выполнения локально (если `migrate` не установлен):

    go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
    migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/skin_service?sslmode=disable" up


## Seed-данные

### Автоматические seed (Docker Compose)

После миграций автоматически применяются seed-данные:
- Запускается контейнер `seed` (смотри Dockerfile.seed)
- Seed скрипт `scripts/seeds.sql` импортируется через `psql`

Для ручного выполнения:

    docker compose up seed

Для ручного выполнения в Docker-контейнере PostgreSQL (локальный):

    docker cp scripts/seeds.sql skin-service-postgres:/tmp/seeds.sql
    docker exec -it skin-service-postgres psql -U postgres -d skin_service -f /tmp/seeds.sql

Для ручного выполнения в консоли PostgreSQL (локальный):

    psql -U postgres -d skin_service -f scripts/seeds.sql


## Swagger UI

Swagger доступен по адресу http://localhost:8080/swagger/index.html

Генерация документации:

    swag init -g cmd/server/main.go


## Полезные команды

Пересборка Docker:

    docker compose down
    docker compose up --build

Запуск Docker (все):

    docker compose up

Запуск только сервисов PostgreSQL + Migrate + Seed для тестирования:

    docker compose up postgres migrate seed

Полный сброс данных (PostgreSQL + MinIO):

    docker compose down -v
