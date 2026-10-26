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
