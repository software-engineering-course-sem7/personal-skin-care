# Infrastructure

## Клонирование репозиториев

Клонируйте все репозитории проекта в одну директорию:

```bash
git clone https://github.com/pp-sem6-team/infra.git
git clone https://github.com/pp-sem6-team/backend.git
git clone https://github.com/pp-sem6-team/ml-service.git
```

Структура директорий должна выглядеть так:

```text
project/
├── infra/
├── backend/
└── ml-service/
```

## Подготовка окружения

Перейдите в infra-репозиторий:

```bash
cd infra
```

Создайте `.env` файл:

```bash
cp .env.example .env
```

При необходимости измените значения переменных окружения.

## Запуск инфраструктуры

Запуск всех сервисов:

```bash
docker compose up --build
```

После запуска будут доступны:

- Backend - http://localhost:8080
- Swagger UI - http://localhost:8080/swagger/index.html
- MinIO API - http://localhost:9000
- MinIO Console - http://localhost:9001
- ML-service - http://localhost:8000
- PostgreSQL - localhost:5432

> При первом запуске проекта необходимо выполнить миграции базы данных и заполнение её seed-данными.\
> Также это нужно делать после полного сброса базы данных (`docker compose down -v`).

## Миграции базы данных

Установка migrate:

```bash
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

Применение миграций:

```bash
migrate -path ../backend/migrations -database "postgres://postgres:postgres@localhost:5432/skin_service?sslmode=disable" up
```

## Seed-данные

Заполнение базы начальными данными:

```bash
docker cp ../backend/scripts/seeds.sql skin-service-postgres:/tmp/seeds.sql

docker exec -it skin-service-postgres \
psql -U postgres -d skin_service -f /tmp/seeds.sql
```

## Полезные команды

Запуск без пересборки:

```bash
docker compose up
```

Запуск с пересборкой:

```bash
docker compose up --build
```

Остановка контейнеров:

```bash
docker compose down
```

Полный сброс данных:

```bash
docker compose down -v
```
