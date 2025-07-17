"use client"

import { ChampionsLeagueIcon } from "@/components/icons/champions-league-icon"
import { LibertadoresIcon } from "@/components/icons/libertadores-icon"
import { PremierLeagueIcon } from "@/components/icons/premier-league-icon"
import { SerieAIcon } from "@/components/icons/serie-a-icon"
import { LaLigaIcon } from "@/components/icons/laliga-icon"
import { SuperLigIcon } from "@/components/icons/super-lig-icon" // New: Import SuperLigIcon
import type { ComponentProps } from "react"

const iconMap = {
  champions_league: ChampionsLeagueIcon,
  libertadores: LibertadoresIcon,
  premier_league: PremierLeagueIcon,
  serie_a: SerieAIcon,
  la_liga: LaLigaIcon,
  super_lig: SuperLigIcon, // New: Add SuperLigIcon to map
}

interface IndexIconProps extends ComponentProps<"div"> {
  iconName: string
}

export function IndexIcon({ iconName, ...props }: IndexIconProps) {
  const IconComponent = iconMap[iconName as keyof typeof iconMap]

  if (!IconComponent) {
    return null // Or a fallback icon
  }

  return <IconComponent {...props} />
}
