"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Categoria = {
  id: number
  nombre_categoria: string
  imagen: string
}

type Props = {
  level: number
  id: number
}

export default function CategoriaGrid({ level, id }: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(`/api/categorias/especifica/${level}/${id}`)
        const data = await res.json()
        setCategorias(data)
      } catch (error) {
        console.error("Error al cargar categorías", error)
      }
    }

    fetchCategorias()
  }, [level, id])

  const handleClick = (categoriaId: number) => {
    router.push(`/categoria/${level + 1}/${categoriaId}`)
  }

  return (
    <div className="p-4">
      <h2 className="text-center text-white bg-red-600 py-2 font-bold mb-4">SUBCATEGORIA</h2>
      {categorias.length > 0 ? (
  <div
    className={`gap-4 ${
      categorias.length < 4
        ? "flex justify-center flex-wrap"
        : "grid grid-cols-2 md:grid-cols-4"
    }`}
  >
    {categorias.map((cat) => (
      <div
        key={cat.id}
        className="cursor-pointer text-center hover:scale-105 transition w-40"
        onClick={() => handleClick(cat.id)}
      >
        <img
          src={cat.imagen || "/placeholder.png"}
          alt={cat.nombre_categoria}
          className="mx-auto h-32 object-contain"
        />
        <p className="mt-2 font-medium">{cat.nombre_categoria}</p>
      </div>
    ))}
  </div>
) : (
  <p className="text-center">No se encontraron subcategorías.</p>
)}

    </div>
  )
}
