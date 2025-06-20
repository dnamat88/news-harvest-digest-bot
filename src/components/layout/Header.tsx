
import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthProvider'
import { LogOut, User } from 'lucide-react'

export const Header = () => {
  const { user, signOut } = useAuth()

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
