"use client"

import { useActionState, useRef } from "react"
import { loginAction } from "@/lib/actions/login"
import { IconMail, IconLock, IconArrowRight } from "@tabler/icons-react"

export function LoginForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, pending] = useActionState(
    async (_prev: { error: string | null } | null, formData: FormData) => {
      return loginAction(formData)
    },
    null,
  )

  function fillTestLogin(email: string) {
    if (!formRef.current) return
    const form = formRef.current
    ;(form.elements.namedItem("email") as HTMLInputElement).value = email
    ;(form.elements.namedItem("password") as HTMLInputElement).value = "admin123"
    form.requestSubmit()
  }

  return (
    <>
      <form ref={formRef} action={action} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <div className="relative">
            <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              autoComplete="username"
              placeholder="you@example.com"
              className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember_me"
            name="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-foreground focus:ring-foreground/20"
          />
          <label htmlFor="remember_me" className="text-sm text-muted-foreground">
            Keep me signed in
          </label>
        </div>

        {state?.error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 transition-opacity"
        >
          {pending ? "Signing in..." : (
            <>
              Sign In <IconArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground text-center">Test login</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fillTestLogin("admin@university.edu")}
            className="flex-1 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => fillTestLogin("editor@university.edu")}
            className="flex-1 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
          >
            Editor
          </button>
        </div>
      </div>
    </>
  )
}
