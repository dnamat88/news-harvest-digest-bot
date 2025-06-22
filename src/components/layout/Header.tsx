
import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthProvider'
import { LogOut, User, Menu } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export const Header = () => {
  const { user, signOut } = useAuth()
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/f30e033a-dcdc-467e-bee0-e5292115598d.png" 
              alt="FlashBrief Logo" 
              className="h-6 w-6"
            />
            <h1 className="text-lg font-semibold">FlashBrief</h1>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground pb-4 border-b">
                  <User className="h-4 w-4" />
                  <span className="truncate">{user?.email}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={signOut}
                  className="flex items-center gap-2 justify-start"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/f30e033a-dcdc-467e-bee0-e5292115598d.png" 
            alt="FlashBrief Logo" 
            className="h-8 w-8"
          />
          <h1 className="text-xl font-semibold">FlashBrief</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {user?.email}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
