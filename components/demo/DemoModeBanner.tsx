"use client"

import { useDemoMode } from "@/lib/demo/DemoModeContext"
import { Button } from "@/components/ui/button"
import { X, Sparkles, RotateCcw } from "lucide-react"
import { useState } from "react"

export function DemoModeBanner() {
  const { isDemoMode, toggleDemoMode, demoBalance, resetDemo } = useDemoMode()
  const [isVisible, setIsVisible] = useState(true)

  if (!isDemoMode || !isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-success/20 bg-card/95 backdrop-blur-sm shadow-lg animate-in slide-in-from-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-1.5 rounded-lg bg-success/10 border border-success/20">
              <Sparkles className="h-4 w-4 text-success" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm sm:text-base text-foreground">Demo Mode</span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Balance: <span className="font-bold text-success">{demoBalance.toFixed(2)} CHZ</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Try buying and selling indices without connecting a wallet
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={resetDemo}
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 text-xs sm:text-sm"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
