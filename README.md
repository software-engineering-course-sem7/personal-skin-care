# Personal Skin Care

## Запуск

### Предварительные требования

Для запуска необходимы установленные **Docker**, **Docker Compose** и свободные порты: `8080`, `5173`, `8000`, `5432`, `9000`, `9001`.

### Установка зависимостей

```bash
# Клонирование репозитория
git clone https://github.com/software-engineering-course-sem7/personal-skin-care.git
cd personal-skin-care

# Создание файла конфигурации окружения
cp src/.env.example src/.env

# Скачивание весов ML-модели
curl -L -o src/ml-service/models/efficientnet_merged.pth "https://drive.google.com/uc?export=download&id=1GaBZKCR4TTZ-C4sq8WmrKzEsPSTDfhO0"
```

Зависимости сервисов устанавливаются автоматически при сборке Docker-образов. Файл весов модели не хранится в репозитории; если автоматическое скачивание недоступно, скачайте его по [ссылке](https://drive.google.com/uc?export=download&id=1GaBZKCR4TTZ-C4sq8WmrKzEsPSTDfhO0) вручную и поместите в папку `src/ml-service/models/`.

### Запуск

```bash
cd src
docker compose up --build
```

### Проверка работоспособности

**1. Проверка бэкенда и API**

```bash
curl http://localhost:8080/health
```

Ожидаемый ответ: `{"status":"ok"}`.

Документация API (Swagger UI): [http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html)

**2. Проверка фронтенда**

Веб-интерфейс: [http://localhost:5173](http://localhost:5173)

**3. Сценарий сквозного тестирования**

Зарегистрируйте нового пользователя на [http://localhost:5173/register](http://localhost:5173/register), загрузите тестовое фото лица на странице `/upload` и проверьте отображение результата анализа кожи, описания и рекомендаций на странице `/result/...`.

## Независимая проверка запуска

**Дата проверки:** 27.10.2026
**Проверяющий:** Александра Дугина
**Операционная система:** macOS (Apple Silicon, ARM64)
**Ветка:** `lab-1`

### Окружение

- Go 1.25.0
- Docker Engine 28.0.1
- Docker Compose 2.33.1

### Выполненные действия

1. Репозиторий получен локально, выбрана ветка `lab-1`.
2. Создан файл `src/.env` на основе `src/.env.example`.
3. Скачана модель `efficientnet_merged.pth` и размещена в `src/ml-service/models/`.
4. Проверена конфигурация Docker Compose командой `docker compose config --quiet` — ошибок не обнаружено.
5. Выполнена попытка запуска проекта через `docker compose up --build`.
6. Дополнительно выполнена локальная проверка сборки backend командой `go build ./cmd/server`.

### Результаты проверки

Docker успешно скачал образы PostgreSQL и MinIO, собрал образы `migrate`, `seed` и `ml-service`.

Сборка backend завершилась ошибкой:

```text
internal/handler/health.go:11:2: no required module provides package github.com/pp-sem6-team/backend/internal/integration/storage
internal/handler/errors.go:11:2: no required module provides package github.com/pp-sem6-team/backend/internal/integration/storage/minio
```

Аналогичная ошибка воспроизводится при локальной сборке backend через Go.

**Итог:** полный запуск приложения не выполнен из-за отсутствующих пакетов `storage` и `storage/minio` в исходном коде backend. Проверить работу пользовательского интерфейса и взаимодействие сервисов не удалось.

Проблема зарегистрирована в GitHub Issue #2.

**Примечание:** при запуске Docker первоначально возникла локальная ошибка `docker-credential-desktop`. Для проверки использована временная конфигурация Docker, после чего сборка проекта продолжилась и выявила ошибку backend.
