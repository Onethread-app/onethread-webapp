import { Accounts } from '.'

let accounts

beforeEach(async () => {
  accounts = await Accounts.create({ email: 'test', password: 'test', type: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = accounts.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(accounts.id)
    expect(view.email).toBe(accounts.email)
    expect(view.password).toBe(accounts.password)
    expect(view.type).toBe(accounts.type)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = accounts.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(accounts.id)
    expect(view.email).toBe(accounts.email)
    expect(view.password).toBe(accounts.password)
    expect(view.type).toBe(accounts.type)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
