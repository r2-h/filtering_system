import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ProductState } from "@/lib/validators/product-validator"

const COLOR_FILTERS = {
  id: "color",
  name: "Color",
  options: [
    { value: "white", label: "White" },
    { value: "beige", label: "Beige" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
  ] as const,
}

type TColorFilter = {
  filter: ProductState
  applyArrayFilter: ({
    category,
    value,
  }: {
    category: keyof Pick<ProductState, "color" | "size">
    value: string
  }) => void
}

export const ColorFilter = ({ filter, applyArrayFilter }: TColorFilter) => {
  return (
    <Accordion type="multiple" className="animate-none">
      <AccordionItem value="color">
        <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900">Color</span>
        </AccordionTrigger>

        <AccordionContent className="pt-6 animate-none">
          <ul className="space-y-4">
            {COLOR_FILTERS.options.map((option, optionIdx) => (
              <li key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`color-${optionIdx}`}
                  onChange={() => {
                    applyArrayFilter({
                      category: "color",
                      value: option.value,
                    })
                  }}
                  checked={filter.color.includes(option.value)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 "
                />
                <label htmlFor={`color-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                  {option.label}
                </label>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
