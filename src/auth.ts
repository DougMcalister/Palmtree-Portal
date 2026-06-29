export type LoginRole = 'client' | 'supplier'

type CredentialRecord = {
  role: LoginRole
  username: string
  credentialHash: string
  redirectPath: string
}

const blockedLoginUsernames = new Set(['cDemo', 'sDemo'])

const credentialStore: CredentialRecord[] = [
  {
    role: 'client',
    username: 'MelvilleCity',
    credentialHash: 'e9587fd314761a3e5139507ca31ac8c0ee35b9269106cda62da33ea30e36aa55',
    redirectPath: '/client',
  },
  {
    role: 'supplier',
    username: 'TimsTrees',
    credentialHash: '927a11e7b02ef1b3ceaf094fd450ffa05eb65fe836867cc10b82c31e5f5e9319',
    redirectPath: '/supplier',
  },
]

function bytesToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function hashCredential(username: string, password: string) {
  const payload = new TextEncoder().encode(`${username}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', payload)
  return bytesToHex(digest)
}

export async function authenticateUser(role: LoginRole, username: string, password: string) {
  const normalizedUsername = username.trim()

  if (blockedLoginUsernames.has(normalizedUsername)) {
    return { ok: false as const, redirectPath: undefined }
  }

  const credential = credentialStore.find(
    (record) => record.role === role && record.username === normalizedUsername,
  )

  if (!credential) {
    return { ok: false as const, redirectPath: undefined }
  }

  const submittedHash = await hashCredential(normalizedUsername, password)

  if (submittedHash !== credential.credentialHash) {
    return { ok: false as const, redirectPath: undefined }
  }

  sessionStorage.setItem(
    'palmtree-auth-session',
    JSON.stringify({
      role: credential.role,
      username: credential.username,
      signedInAt: new Date().toISOString(),
    }),
  )

  return { ok: true as const, redirectPath: credential.redirectPath }
}
