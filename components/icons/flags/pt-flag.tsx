import type React from "react"
export const PtFlag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 15" {...props}>
    <path fill="#009739" d="M0 0h22v15H0z" />
    <path fill="#fedd00" d="M11 1.875L20.625 7.5 11 13.125 1.375 7.5z" />
    <path fill="#002776" d="M11 9.375a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
    <path fill="#fff" d="M11 5.625a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z" />
  </svg>
)
