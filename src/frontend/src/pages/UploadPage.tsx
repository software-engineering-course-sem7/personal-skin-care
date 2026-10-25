import { PaperclipIcon } from '@/shared/icons/PaperclipIcon'
import { AppPageShell } from '@/shared/layout/AppPageShell'
import { PageCenter, PageSection } from '@/shared/layout/PageContent'
import { analysisApi, getApiError, isAuthenticated, isUnauthorized } from '@/shared/api'
import { Loader2, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UploadPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png']
    if (!validTypes.includes(file.type)) {
      setError('Формат должен быть JPG или PNG')
      return false
    }
    const maxSize = 10 * 1024 * 1024 // 10 MB
    if (file.size > maxSize) {
      setError('Размер файла не должен превышать 10 MB')
      return false
    }
    setError(null)
    return true
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!validateFile(file)) return

    // Превью
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsLoading(true)
    setError(null)

    if (!isAuthenticated()) {
      setIsLoading(false)
      navigate('/login')
      return
    }

    try {
      const created = await analysisApi.uploadPhoto(file)
      navigate(`/result/${created.id}`)
    } catch (err) {
      if (isUnauthorized(err)) {
        navigate('/login')
        return
      }
      const apiError = getApiError(err)
      setError(apiError.message)
      setPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } finally {
      setIsLoading(false)
    }
  }

  const clearPreview = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <AppPageShell showProfile>
      <PageCenter>
        <PageSection className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-text-main md:text-3xl">
            Прикрепите фотографию
          </h1>

          <div className="mt-8 w-full max-w-md">
            {!preview ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-primary transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <PaperclipIcon className="mx-auto h-12 w-12 text-text-secondary" />
                <p className="mt-2 text-sm text-text-secondary">Нажмите или перетащите фото</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 rounded-xl mx-auto shadow-md"
                />
                {!isLoading && (
                  <button
                    onClick={clearPreview}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={20} />
                  </button>
                )}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                    <Loader2 className="animate-spin text-white" size={32} />
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-full text-sm">
              {error}
            </div>
          )}

          <div className="mt-10 max-w-xl space-y-4 text-sm leading-relaxed text-text-secondary">
            <p>Ваши данные защищены. Анализ занимает меньше минуты.</p>
            <p>
              Для точного анализа: фото должно быть хорошо освещено (лучше при естественном свете),
              без фильтров.
            </p>
            <p>Качество — не ниже 720×720 px (оптимально от 1080×1080 px).</p>
            <p>Лицо — чётко видно, по центру кадра, без макияжа и перекрытий.</p>
            <p>Формат — JPG или PNG.</p>
          </div>
        </PageSection>
      </PageCenter>
    </AppPageShell>
  )
}