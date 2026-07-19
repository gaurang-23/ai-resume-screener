import LogoMark from "./LogoMark";

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="flex min-h-screen font-body text-ink">
    {/* Branding panel */}
    <div className="relative hidden w-1/2 flex-col justify-between bg-ink p-12 text-paper lg:flex">
      <div className="flex items-center gap-2">
        <LogoMark />
        <span className="font-display text-xl font-semibold tracking-tight">Intake</span>
      </div>
      <div className="max-w-sm">
        <p className="font-display text-4xl font-semibold leading-tight">
          Every resume gets a fair, fast read.
        </p>
        <p className="mt-4 text-sm text-paper/60">
          Upload a resume and a job description. Intake scores the match and tells you exactly
          why, in seconds.
        </p>
      </div>
      <p className="font-mono text-xs text-paper/40">© {new Date().getFullYear()} Intake</p>
    </div>

    {/* Form panel */}
    <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <LogoMark />
          <span className="font-display text-xl font-semibold">Intake</span>
        </div>
        <h1 className="font-display text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-ink-light">{subtitle}</p>
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
