import { AppPageShell } from '@/shared/layout/AppPageShell'
import { PageCenter } from '@/shared/layout/PageContent'
import {
  authApi,
  birthDateToApi,
  genderToApi,
  getApiError,
} from '@/shared/api'
import Button from '@/shared/ui/Button'
import Card from '@/shared/ui/Card'
import Input from '@/shared/ui/Input'
import Select from '@/shared/ui/Select'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const genderOptions = [
  { value: '', label: '-' },
  { value: 'Ж', label: 'Ж' },
  { value: 'М', label: 'М' },
]

const fieldRounding = 'rounded-full py-4 text-base md:py-[1.125rem]'

type RegisterErrors = {
  email?: string
  password?: string
  name?: string
  server?: string
}

function validateRegister(email: string, password: string, name: string): RegisterErrors {
  const next: RegisterErrors = {}
  const e = email.trim()
  const p = password.trim()
  const n = name.trim()

  if (!e) next.email = 'Укажите почту'
  if (!p) next.password = 'Укажите пароль'
  if (!n) next.name = 'Укажите имя и фамилию'

  return next
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async () => {
    // Клиентская валидация
    const clientErrors = validateRegister(email, password, name)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return

    setIsLoading(true)
    setErrors({}) // очищаем предыдущие ошибки

    try {
      await authApi.register({
        email: email.trim(),
        password,
        name: name.trim(),
        birth_date: birthDateToApi(birthDate),
        gender: genderToApi(gender),
      })
      navigate('/upload')
    } catch (err) {
      const apiError = getApiError(err)
      if (apiError.status === 409 || apiError.code === 'ALREADY_EXISTS') {
        setErrors({ email: 'Пользователь с такой почтой уже существует' })
      } else {
        setErrors({ server: apiError.message || 'Не удалось зарегистрироваться' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppPageShell>
      <PageCenter className="min-h-[calc(100svh-2.25rem)] items-center justify-center pb-20 pt-6 md:pt-10">
        <Card
          variant="primary"
          className="mx-auto w-full max-w-[480px] rounded-[28px] sm:!rounded-[36px] !p-6 sm:!p-10 md:!px-12 md:!py-12 shadow-none"
        >
          <h1 className="text-center text-[2rem] sm:text-[2.625rem] md:text-[3rem] font-black leading-tight text-text-main md:leading-none">
            Регистрация
          </h1>

          <div className="mt-6 sm:mt-10 space-y-4 sm:space-y-5">
            <Input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Почта"
              value={email}
              onChange={(ev) => {
                setEmail(ev.target.value)
                setErrors((prev) => ({ ...prev, email: undefined, server: undefined }))
              }}
              error={Boolean(errors.email)}
              errorMessage={errors.email}
              inputClassName={fieldRounding}
            />
            <Input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Пароль"
              value={password}
              onChange={(ev) => {
                setPassword(ev.target.value)
                setErrors((prev) => ({ ...prev, password: undefined, server: undefined }))
              }}
              error={Boolean(errors.password)}
              errorMessage={errors.password}
              inputClassName={fieldRounding}
            />
            <Input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Имя и фамилия"
              value={name}
              onChange={(ev) => {
                setName(ev.target.value)
                setErrors((prev) => ({ ...prev, name: undefined, server: undefined }))
              }}
              error={Boolean(errors.name)}
              errorMessage={errors.name}
              inputClassName={fieldRounding}
            />
            <Input
              type="date"
              name="birthDate"
              label="Дата рождения"
              value={birthDate}
              onChange={(ev) => setBirthDate(ev.target.value)}
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

          <div className="mt-8 sm:mt-10 flex flex-col items-center gap-5">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full justify-center rounded-full border-primary bg-primary px-4 sm:px-8 py-[1.125rem] text-lg font-extrabold shadow-none hover:bg-primary-hover md:py-5 md:text-xl disabled:opacity-70"
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-sm font-medium text-text-secondary hover:bg-transparent hover:text-text-secondary/80"
              onClick={() => navigate('/login')}
            >
              Вход
            </Button>
          </div>
        </Card>
      </PageCenter>
    </AppPageShell>
  )
}