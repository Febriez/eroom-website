'use client'

import { useState } from 'react'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { Download } from 'lucide-react'

interface FileDownloaderProps {
  storagePath: string
  displayName?: string
  buttonText?: string
  className?: string
}

const FileDownloader = ({
  storagePath,
  displayName,
  buttonText = '다운로드',
  className = ''
}: FileDownloaderProps) => {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setDownloading(true)
    setError(null)

    try {
      const storage = getStorage()
      const fileRef = ref(storage, storagePath)
      const downloadURL = await getDownloadURL(fileRef)

      // 파일 이름 추출
      const fileName = displayName || storagePath.split('/').pop() || 'downloaded-file'

      // 다운로드 링크 생성 및 클릭
      const link = document.createElement('a')
      link.href = downloadURL
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (err) {
      console.error('파일 다운로드 오류:', err)
      setError('파일을 다운로드하는 중 오류가 발생했습니다.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className={className}>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5" />
        {downloading ? '다운로드 중...' : buttonText}
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}

export default FileDownloader
