import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-muted/50">
      <div className="w-full max-w-sm bg-background rounded-xl shadow-sm border border-t-[3px] border-t-primary p-8">
        <div className="space-y-1.5 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
