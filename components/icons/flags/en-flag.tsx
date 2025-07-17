import type React from "react"
export const EnFlag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" {...props}>
    <path fill="#00247d" d="M0 0h600v300H0z" />
    <path stroke="#fff" strokeWidth="30" d="M0 0l600 300M600 0L0 300" />
    <path stroke="#c60c30" strokeWidth="20" d="M0 0l600 300M600 0L0 300" />
    <path stroke="#fff" strokeWidth="50" d="M300 0v300M0 150h600" />
    <path stroke="#c60c30" strokeWidth="30" d="M300 0v300M0 150h600" />
  </svg>
)
