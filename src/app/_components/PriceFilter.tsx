import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { ProductState } from "@/lib/validators/product-validator"

const PRICE_FILTERS = {
  id: "price",
  name: "Price",
  options: [
    { value: [0, 100], label: "Any price" },
    { value: [0, 40], label: "Under 40$" },
  ] as const,
}
const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number]

export const PriceFilter = ({
  filter,
  setFilter,
  debounceSubmit,
}: {
  filter: ProductState
  setFilter: (filter: ProductState) => void
  debounceSubmit: any
}) => {
  const minPrice = Math.min(filter.price.range[0], filter.price.range[1])
  const maxPrice = Math.max(filter.price.range[0], filter.price.range[1])

  return (
    <Accordion type="multiple" className="animate-none">
      <AccordionItem value="price">
        <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900">Price</span>
        </AccordionTrigger>

        <AccordionContent className="pt-6 animate-none">
          <ul className="space-y-4">
            {/* Any price   Under 40$ */}
            {PRICE_FILTERS.options.map((option, optionIdx) => (
              <li key={option.label} className="flex items-center">
                <input
                  type="radio"
                  id={`price-${optionIdx}`}
                  onChange={() => {
                    setFilter({
                      ...filter,
                      price: {
                        isCustom: false,
                        range: [...option.value],
                      },
                    })
                    debounceSubmit()
                  }}
                  checked={
                    !filter.price.isCustom &&
                    filter.price.range[0] === option.value[0] &&
                    filter.price.range[1] === option.value[1]
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={`price-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                  {option.label}
                </label>
              </li>
            ))}
            {/* Custom */}
            <li className="flex justify-center flex-col gap-2">
              <div>
                <input
                  type="radio"
                  id={`price-${PRICE_FILTERS.options.length}`}
                  onChange={() => {
                    setFilter({
                      ...filter,
                      price: {
                        isCustom: true,
                        range: [0, 100],
                      },
                    })
                    debounceSubmit()
                  }}
                  checked={filter.price.isCustom}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={`price-${PRICE_FILTERS.options.length}`} className="ml-3 text-sm text-gray-600">
                  Custom
                </label>
              </div>

              <div className="flex justify-between">
                <p className="font-medium">Price</p>
                <div>
                  {filter.price.isCustom ? minPrice.toFixed(0) : filter.price.range[0].toFixed(0)} € -{" "}
                  {filter.price.isCustom ? maxPrice.toFixed(0) : filter.price.range[1].toFixed(0)} €
                </div>
              </div>
              <Slider
                className={cn({
                  "opacity-50": !filter.price.isCustom,
                })}
                disabled={!filter.price.isCustom}
                onValueChange={(range) => {
                  const [newMin, newMax] = range
                  setFilter({
                    ...filter,
                    price: {
                      isCustom: true,
                      range: [newMin, newMax],
                    },
                  })
                  debounceSubmit()
                }}
                value={filter.price.isCustom ? filter.price.range : DEFAULT_CUSTOM_PRICE}
                min={DEFAULT_CUSTOM_PRICE[0]}
                defaultValue={DEFAULT_CUSTOM_PRICE}
                max={DEFAULT_CUSTOM_PRICE[1]}
                step={5}
              />
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
