"use client"

import Product from "@/components/Products/Product"
import ProductSkeleton from "@/components/Products/ProductSkeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Product as TProduct } from "@/db"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { QueryResult } from "@upstash/vector"
import axios from "axios"
import { ChevronDown, Filter } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { ColorFilter } from "./_components/ColorFilter"
import { SubcategoriesFilter } from "./_components/SubcategoriesFilter"
import { ProductState } from "@/lib/validators/product-validator"
import { SizeFilter } from "./_components/SizeFilter"
import { PriceFilter } from "./_components/PriceFilter"
import debounce from "lodash.debounce"
import { EmptyState } from "@/components/Products/EmptyState"

const SORT_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
] as const

export default function Home() {
  const [filter, setFilter] = useState<ProductState>({
    sort: "none",
    color: ["white", "beige", "blue", "green", "purple"],
    price: { isCustom: true, range: [0, 20] },
    size: ["L", "M", "S"],
  })

  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<TProduct>[]>("http://localhost:3000/api/products", {
        filter: { sort: filter.sort, color: filter.color, price: filter.price.range, size: filter.size },
      })
      return data
    },
  })
  const onSubmit = () => refetch()
  const debounceSubmit = useCallback(debounce(onSubmit, 400), [])

  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: keyof Pick<typeof filter, "color" | "size">
    value: string
  }) => {
    const isFilterApplied = filter[category].includes(value as never)

    if (isFilterApplied) {
      setFilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value),
      }))
    } else {
      setFilter((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }))
    }
    debounceSubmit()
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Hight-quality cotton selection</h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
              Sort
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <button
                  className={cn("text-left w-full block px-4 py-2 text-sm", {
                    "text-gray-900 bg-gray-100": option.value === filter.sort,
                    "text-gray-500": option.value !== filter.sort,
                  })}
                  key={option.value}
                  onClick={() => {
                    setFilter((prev) => ({ ...prev, sort: option.value }))
                    debounceSubmit()
                  }}
                >
                  {option.name}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          <div className="hidden lg:block">
            <SubcategoriesFilter />
            <ColorFilter filter={filter} applyArrayFilter={applyArrayFilter} />
            <SizeFilter filter={filter} applyArrayFilter={applyArrayFilter} />
            <PriceFilter filter={filter} setFilter={setFilter} debounceSubmit={debounceSubmit} />
          </div>

          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products && products.length === 0 ? (
              <EmptyState />
            ) : products ? (
              products.map((product) => <Product product={product.metadata!} key={product.id} />)
            ) : (
              new Array(12).fill(null).map((_, i) => <ProductSkeleton key={i} />)
            )}
          </ul>
        </div>
      </section>
    </main>
  )
}
