import { AppPageShell } from '@/shared/layout/AppPageShell'
import {
  authApi,
  formToUpdateUserRequest,
  getApiError,
  isAuthenticated,
  isUnauthorized,
  userApi,
  userToForm,
} from '@/shared/api'
import Button from '@/shared/ui/Button'
import Card from '@/shared/ui/Card'
import Input from '@/shared/ui/Input'
import Select from '@/shared/ui/Select'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const greenBtn =
  'rounded-xl !border-accent-green !bg-accent-green text-text-main shadow-none hover:!bg-accent-green hover:brightness-[0.96] focus-visible:ring-accent-green/70'

const genderOptions = [
  { value: '', label: '-' },
  { value: 'Ж', label: 'Ж' },
  { value: 'М', label: 'М' },
]

const fieldRounding = 'rounded-full py-3.5'

type FormErrors = {
  email?: string
  password?: string
  passwordRepeat?: string
  fullName?: string
  server?: string
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')

  // Поля формы
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  // Загрузка текущих данных пользователя
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated()) {
        navigate('/login')
        return
      }

      try {
        const user = await userApi.getMe()
        const form = userToForm(user)
        setEmail(form.email)
        setFullName(form.fullName)
        setBirthDate(form.birthDate)
        setGender(form.gender)
      } catch (err) {
        if (isUnauthorized(err)) {
          navigate('/login')
          return
        }
        setErrors({ server: getApiError(err).message || 'Ошибка загрузки профиля' })
      } finally {
        setIsFetching(false)
      }
    }

    loadUserData()
  }, [navigate])

  const handleSave = async () => {
    // Валидация
    const newErrors: FormErrors = {}
    if (!email.trim()) newErrors.email = 'Укажите почту'
    else if (!email.includes('@')) newErrors.email = 'Введите корректную почту'
    if (!fullName.trim()) newErrors.fullName = 'Укажите имя и фамилию'
    if (password && password !== passwordRepeat) {
      newErrors.passwordRepeat = 'Пароли не совпадают'
    }
    if (password && password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)
    setSuccessMessage('')
    setErrors({})

    try {
      if (!isAuthenticated()) {
        navigate('/login')
        return
      }

      await userApi.updateMe(
        formToUpdateUserRequest({
          email,
          fullName,
          birthDate,
          gender,
        }),
      )

      // TODO: PATCH /users/me/password — нужно поле current_password в UI

      setSuccessMessage('Данные успешно обновлены')
      setTimeout(() => setSuccessMessage(''), 3000)
      setPassword('')
      setPasswordRepeat('')
    } catch (err) {
      if (isUnauthorized(err)) {
        navigate('/login')
        return
      }
      setErrors({ server: getApiError(err).message || 'Ошибка сохранения' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch {
      // logout локально даже при ошибке API
    }
    navigate('/login')
  }

  if (isFetching) {
    return (
      <AppPageShell>
        <div className="flex justify-center items-center h-screen">Загрузка профиля...</div>
      </AppPageShell>
    )
  }

  return (
    <AppPageShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-20 pt-16 md:flex-row md:px-12 md:pt-20 lg:gap-14">
        <aside className="flex w-full shrink-0 flex-col gap-4 md:w-56">
          <Button
            type="button"
            variant="primary"
            className="w-full justify-center rounded-xl py-4 shadow-none"
            onClick={() => navigate('/history')}
          >
            История запросов
          </Button>
          <Button
            type="button"
            variant="danger"
            className="w-full justify-center rounded-xl py-4 shadow-none"
            onClick={handleLogout}
          >
            Выход
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={`w-full justify-center rounded-xl py-4 ${greenBtn}`}
            onClick={() => navigate('/upload')}
          >
            Вернуться
          </Button>
        </aside>

        <Card variant="primary" className="min-w-0 flex-1 shadow-none px-4 sm:px-6 md:px-8">
          <h1 className="text-center text-2xl font-bold text-text-main">Изменить</h1>

          {successMessage && (
            <div className="mt-4 p-2 text-center text-sm text-green-700 bg-green-100 rounded-full">
              {successMessage}
            </div>
          )}

          <div className="mt-8 space-y-4">
            <Input
              type="email"
              name="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors((prev) => ({ ...prev, email: undefined, server: undefined }))
              }}
              error={Boolean(errors.email)}
              errorMessage={errors.email}
              inputClassName="rounded-full py-3.5"
            />
            <Input
              type="password"
              name="password"
              placeholder="Новый пароль (оставьте пустым, чтобы не менять)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((prev) => ({ ...prev, password: undefined, passwordRepeat: undefined }))
              }}
              error={Boolean(errors.password)}
              errorMessage={errors.password}
              inputClassName="rounded-full py-3.5"
            />
            <Input
              type="password"
              name="passwordRepeat"
              placeholder="Повторить новый пароль"
              value={passwordRepeat}
              onChange={(e) => {
                setPasswordRepeat(e.target.value)
                setErrors((prev) => ({ ...prev, passwordRepeat: undefined }))
              }}
              error={Boolean(errors.passwordRepeat)}
              errorMessage={errors.passwordRepeat}
              inputClassName="rounded-full py-3.5"
            />
            <Input
              type="text"
              name="name"
              placeholder="Имя и фамилия"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                setErrors((prev) => ({ ...prev, fullName: undefined }))
              }}
              error={Boolean(errors.fullName)}
              errorMessage={errors.fullName}
              inputClassName="rounded-full py-3.5"
            />
            <Input
              type="date"
              name="birthDate"
              label="Дата рождения"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              inputClassName={`${fieldRounding} min-h-[3.25rem] [color-scheme:light]`}
            />
            <div className="w-full sm:max-w-[200px]">
              <Select
                label="Пол"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                options={genderOptions}
                selectClassName={fieldRounding}
                fullWidth
              />
            </div>
            {errors.server && (
              <div className="text-center text-sm text-error bg-error/10 p-2 rounded-full">
                {errors.server}
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              className={`rounded-xl px-10 py-3 ${greenBtn} disabled:opacity-70`}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </Card>
      </div>
    </AppPageShell>
  )
}