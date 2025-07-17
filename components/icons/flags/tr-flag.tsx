import type React from "react"
export const TrFlag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" {...props}>
    <path fill="#e30a17" d="M0 0h900v600H0z" />
    <circle cx="300" cy="300" r="200" fill="#fff" />
    <circle cx="330" cy="300" r="160" fill="#e30a17" />
    <path fill="#fff" d="m450 390-30.9-95.1 80.9-58.8H399.1L368.2 195l-30.9 95.1-80.9 58.8h101.8z" />
  </svg>
)
