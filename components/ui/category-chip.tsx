import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CategoryChipProps {
  category: string
  isActive?: boolean
  href?: string
  className?: string
}

export function CategoryChip({ category, isActive, href, className }: CategoryChipProps) {
  const variant = isActive === true ? "default" : isActive === false ? "outline" : "secondary"
  
  const content = (
    <Badge
      variant={variant}
      className={cn(
        "rounded-full px-3 py-1 capitalize font-medium transition-colors",
        isActive === true && "hover:bg-primary/90",
        isActive === false && "hover:bg-accent hover:text-accent-foreground",
        isActive === undefined && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        className
      )}
    >
      {category}
    </Badge>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    )
  }

  return content
}
