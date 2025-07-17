import type React from "react"
export const ItFlag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" {...props}>
    <path fill="#009246" d="M0 0h300v600H0z" />
    <path fill="#fff" d="M300 0h300v600H300z" />
    <path fill="#ce2b37" d="M600 0h300v600H600z" />
  </svg>
)
