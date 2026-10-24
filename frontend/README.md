# Frontend

## Стек
- React
- TypeScript
- Vite
- Tailwind CSS


## Установка и запуск

### 1. Клонируйте репозиторий
```bash
git clone https://github.com/pp-sem6-team/frontend.git
cd frontend
```

### 2. Установите зависимости

```bash
npm install
```

### 3. Запустите проект (dev mode)

```bash
npm run dev
```

Приложение будет доступно:

```
http://localhost:5173
```


## Основные команды

| Команда         | Описание                   |
| --------------- | -------------------------- |
| npm install     | установка зависимостей     |
| npm run dev     | запуск dev сервера         |
| npm run build   | сборка проекта             |
| npm run preview | просмотр production сборки |



## Структура проекта

```
src/
 ├── app/        # инициализация приложения (роутинг, провайдеры)
 ├── pages/      # страницы (Login, Profile и т.д.)
 ├── features/   # бизнес-фичи (auth, upload photo)
 ├── shared/     # переиспользуемый код
 │    ├── ui/    # UI компоненты
 │    ├── api/   # запросы к backend
 │    ├── lib/   # утилиты
 │    └── config # конфигурации
 ├── App.tsx
 ├── main.tsx
 └── index.css
```


## Tailwind CSS

Используется через:

```css
@import "tailwindcss";
```


## Alias imports

Настроен alias для импортов:

```ts
@ → /src
```

Пример использования:

```ts
import Button from '@/shared/ui/Button'
```
