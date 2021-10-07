export const stripe = {
  charges: {
    create: jest
      .fn()
      .mockResolvedValue({ id: "card_1Jh0qWDAeiCkiyphXHPiqkMI" }),
  },
};
