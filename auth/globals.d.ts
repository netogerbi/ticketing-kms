declare namespace NodeJS {
  interface Global {
    signup(): Promise<string[]>;
  }
}
