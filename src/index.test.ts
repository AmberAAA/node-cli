import { add } from "./index";

describe("add", () => {
  it("1+1=2", () => {
    expect(add(2, 1)).toBe(3);
  });
});
