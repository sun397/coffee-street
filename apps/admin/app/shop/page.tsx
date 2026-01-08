'use client'

import { useState, useEffect } from 'react'
import { useShop } from '@/hooks/use-shop'

export default function ShopEditPage() {
  // TanStack Query から 取得(query) と 更新(mutation) を取り出す
  const { shopQuery, updateMutation } = useShop()
  console.log(shopQuery);
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  // データがロードされたら初期値をセットする
  useEffect(() => {
    if (shopQuery.data) {
      setName(shopQuery.data.name ?? '')
      setDesc(shopQuery.data.description ?? '')
    }
  }, [shopQuery.data])

  const handleSave = async () => {
    // mutateAsync を使って非同期実行
    try {
      await updateMutation.mutateAsync({ name, description: desc })
      alert('保存しました！')
    } catch (error) {
      alert('保存に失敗しました')
    }
  }

  // shopQuery.isLoading (または isPending) の間は
  // 編集フォームそのものを出さない、またはローディング表示にする
  if (shopQuery.isLoading || !shopQuery.isEnabled) {
    return <div className="p-8">店舗情報を読み込み中...</div>;
  }

  // データがない場合（エラーなど）のハンドリング
  if (!shopQuery.data) {
    return <div className="p-8">店舗情報が見つかりません。</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">店舗情報編集</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm">店舗名</label>
          <input 
            className="border p-2 w-full text-black"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            disabled={updateMutation.isPending} // 保存中は入力不可
          />
        </div>
        <div>
          <label className="block text-sm">説明</label>
          <textarea 
            className="border p-2 w-full text-black"
            value={desc} 
            onChange={(e) => setDesc(e.target.value)} 
            disabled={updateMutation.isPending} // 保存中は入力不可
          />
        </div>
        <button 
          onClick={handleSave}
          disabled={updateMutation.isPending} // 連打防止
          className={`px-4 py-2 rounded text-white ${
            updateMutation.isPending ? 'bg-gray-400' : 'bg-blue-600'
          }`}
        >
          {updateMutation.isPending ? '保存中...' : '保存する'}
        </button>
      </div>
    </div>
  )
}
