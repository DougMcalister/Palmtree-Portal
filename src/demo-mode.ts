export type DemoMode = 'off' | 'client' | 'supplier'

type ActiveDemoMode = Exclude<DemoMode, 'off'>

type DemoCredential = {
  username: string
  password: string
  redirectPath: string
}

const demoModeStorageKey = 'palmtree-demo-mode'
const authSessionStorageKey = 'palmtree-auth-session'
const demoModeListeners = new Set<() => void>()

export const demoCredentials: Record<ActiveDemoMode, DemoCredential> = {
  client: {
    username: 'cDemo',
    password: 'democlient#',
    redirectPath: '/client',
  },
  supplier: {
    username: 'sDemo',
    password: 'demosupp#',
    redirectPath: '/supplier',
  },
}

function isDemoMode(value: string | null): value is DemoMode {
  return value === 'off' || value === 'client' || value === 'supplier'
}

function emitDemoModeChange() {
  demoModeListeners.forEach((listener) => listener())
}

function isValidDemoCredential(mode: ActiveDemoMode, username: string, password: string) {
  const credential = demoCredentials[mode]

  return credential.username === username && credential.password === password
}

export function subscribeDemoMode(listener: () => void) {
  demoModeListeners.add(listener)

  return () => {
    demoModeListeners.delete(listener)
  }
}

export function getStoredDemoMode(): DemoMode {
  const storedMode = sessionStorage.getItem(demoModeStorageKey)

  return isDemoMode(storedMode) ? storedMode : 'off'
}

export function clearDemoSession() {
  sessionStorage.setItem(demoModeStorageKey, 'off')

  const authSession = sessionStorage.getItem(authSessionStorageKey)

  if (!authSession) {
    emitDemoModeChange()
    return
  }

  try {
    const parsedSession = JSON.parse(authSession) as { demo?: boolean }

    if (parsedSession.demo) {
      sessionStorage.removeItem(authSessionStorageKey)
    }
  } catch {
    sessionStorage.removeItem(authSessionStorageKey)
  }

  emitDemoModeChange()
}

export function startDemoSession(mode: ActiveDemoMode) {
  const credential = demoCredentials[mode]

  if (!isValidDemoCredential(mode, credential.username, credential.password)) {
    throw new Error('Demo credentials are not valid for the selected role.')
  }

  sessionStorage.setItem(demoModeStorageKey, mode)
  sessionStorage.setItem(
    authSessionStorageKey,
    JSON.stringify({
      role: mode,
      username: credential.username,
      demo: true,
      signedInAt: new Date().toISOString(),
    }),
  )

  emitDemoModeChange()

  return credential.redirectPath
}
