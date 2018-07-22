const { Vote } = require('./')

describe.only('Vote model', () => {
  test('does not allow duplicate email & browser sesssion entries', async () => {
    await Vote.create({email: 'react@email.com', sessionId: '1'})
    await expect(Vote.create({email: 'react@email.com', sessionId: '1'})).rejects.toThrow()
  })
})
