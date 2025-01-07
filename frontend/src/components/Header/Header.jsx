import React from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import axios from 'axios'
import { logout } from '@/lib/redux/features/authSlice'
import { useToast } from '@/hooks/use-toast'
import { Library } from 'lucide-react'

const NavMenuLink = React.forwardRef(({ to, children, ...props }, ref) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <NavigationMenuLink asChild active={isActive}>
      <NavLink 
        ref={ref} 
        to={to} 
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`}
        {...props}
      >
        {children}
      </NavLink>
    </NavigationMenuLink>
  )
})

NavMenuLink.displayName = 'NavMenuLink'

export default function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { toast } = useToast()
    const { isAuthenticated, user } = useSelector((state) => state.auth)

    const handleLogout = async() => {
        try {
            await axios.post("/api/v1/user/logout", {
                withCredentials: true,
            });
            toast({
                title: "Logged Out",
            });
            dispatch(logout());
            
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
            toast({
                title: "Logout failed",
                description: "Something went wrong while logging out. Please try again.",
                variant: "destructive",
            });
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <Link to="/" className="flex items-center mr-6">
                    <Library className="h-8 ml-8 w-auto" size = {64}/>
                </Link>
                <NavigationMenu className="hidden md:flex mx-6">
                    <NavigationMenuList className="space-x-4">
                        <NavigationMenuItem>
                            <NavMenuLink to="/">
                                Listings
                            </NavMenuLink>
                        </NavigationMenuItem>
                        {isAuthenticated && (
                            <NavigationMenuItem>
                                <NavMenuLink to={user.role === "admin" ? "/admin" : "/user"}>
                                    {user.role === "user" ? 'Your Book History' : 'Dashboard'}
                                </NavMenuLink>
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="flex-1" />
                <ModeToggle />
                <div className="ml-4 hover:cursor-pointer" >
                    {isAuthenticated ? (
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Avatar>
                                    <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    {user.fullName}
                                    <p className="text-sm text-muted-foreground">
                                        ({user.role === "admin" ? "Admin" : "User"})
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                    
                                    {user.username}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="hover:cursor-pointer text-orange-700 font-bold">
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild>
                            <Link to="/login">Login/Signup</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
