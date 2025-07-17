import type React from "react"
export const FrFlag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" {...props}>
    <path fill="#fff" d="M0 0h900v600H0z" />
    <path fill="#000091" d="M0 0h300v600H0z" />
    <path fill="#e1000f" d="M600 0h300v600H600z" />
  </svg>
)
