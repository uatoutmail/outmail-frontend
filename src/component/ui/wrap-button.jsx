import React from "react"
import Link from "next/link"
import { ArrowRight, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * @param {{ className?: string, children?: React.ReactNode, href?: string }} props
 */
const WrapButton = ({ className, children, href = "/" }) => {
  const outerButtonStyle = cn(
    "group cursor-pointer gap-2 h-[50px] flex items-center p-[11px] rounded-full bg-primary hover:bg-primary-hover transition-colors",
    className
  )

  return (
    <div className="flex items-center justify-center">
      <Link href={href}>
        <div className={outerButtonStyle}>
          <div className="bg-primary rounded-full flex items-center justify-center text-white">
            <Globe className="mx-2 group-hover:text-black" />
            <p className="font-medium tracking-tight mr-3 group-hover:text-black">
              {children ? children : "Get Started"}
            </p>
          </div>
          <div className="text-[#3b3a3a] group-hover:ml-2 ease-in-out transition-all size-[26px] flex items-center justify-center rounded-full border-2 border-[#3b3a3a]">
            <ArrowRight
              size={18}
              className="group-hover:rotate-45 ease-in-out transition-all"
            />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default WrapButton
