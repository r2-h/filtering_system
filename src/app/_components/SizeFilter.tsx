import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ProductState } from "@/lib/validators/product-validator"

const SIZE_FILTERS = {
  id: "size",
  name: "Size",
  options: ["S", "M", "L"] as const,
}

type TSizeFilter = {
  filter: ProductState
  applyArrayFilter: ({ category, value }: { category: keyof Pick<ProductState, "size">; value: string }) => void
}

export const SizeFilter = ({ filter, applyArrayFilter }: TSizeFilter) => {
  return (
    <Accordion type="multiple" className="animate-none">
      <AccordionItem value="size">
        <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900">Size</span>
        </AccordionTrigger>

        <AccordionContent className="pt-6 animate-none">
          <ul className="space-y-4">
            {SIZE_FILTERS.options.map((option, optionIdx) => (
              <li key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`size-${optionIdx}`}
                  onChange={() => {
                    applyArrayFilter({
                      category: "size",
                      value: option,
                    })
                  }}
                  checked={filter.size.includes(option)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 "
                />
                <label htmlFor={`color-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
