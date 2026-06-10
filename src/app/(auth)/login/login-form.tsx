"use client"

import { useActionState, useRef } from "react"
import { loginAction } from "@/lib/actions/login"
import { IconMail, IconLock, IconArrowRight, IconLoader2 } from "@tabler/icons-react"

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
              disabled={pending}
              autoComplete="username"
              placeholder="name@example.com"
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <a
              href="mailto:support@university.edu"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={pending}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember_me"
            name="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
          />
          <label htmlFor="remember_me" className="text-sm text-muted-foreground">
            Remember me
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
          className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 hover:brightness-110 transition-all"
        >
          {pending ? (
            <IconLoader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In <IconArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground text-center">Quick test login</p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => fillTestLogin("admin@university.edu")}
            className="flex-1 rounded-lg border border-primary text-primary px-3 py-2 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Admin
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => fillTestLogin("editor@university.edu")}
            className="flex-1 rounded-lg border border-primary text-primary px-3 py-2 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Editor
          </button>
        </div>
      </div>
    </>
  )
}
