import { use } from "react"
import Categorypadge from "@/components/Categorypadge"

interface PageProps {
  params: Promise<{
    locale: string
    type: string
  }>
}

export default function ProductPage({ params }: PageProps) {
  const resolvedParams = use(params)

  return (
    <div>
      <Categorypadge category={resolvedParams.type} />
    </div>
  )
}