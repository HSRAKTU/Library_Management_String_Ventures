import React from 'react'
import Link from 'react-router-dom'
import { Library, Facebook, Twitter, Github, Dribbble } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <Library className="h-6 w-6" />
              <span className="font-bold">Library Management</span>
            </Link>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-semibold">Resources</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-semibold">Check My Profiles</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/hsraktu/Library_Management_String_Ventures"
                  className="text-sm text-muted-foreground hover:text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </li>
              <li>
                <a
                  href="https://leetcode.com/u/utkarshwashere"
                  className="text-sm text-muted-foreground hover:text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Leetcode
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-semibold">Legal</h2>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              © 2025 Utkarsh Singh. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Dribbble className="h-4 w-4" />
                <span className="sr-only">Dribbble</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

