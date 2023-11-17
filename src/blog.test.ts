import { genBlogString } from "./blog";

const TITLE = "TITLE";
const AUTHORS = "AMBER";
const TAGS = ["tag1", "tag2"];
const BLOG = "这是一段博客文本";

describe("Blog", () => {
  it("genBlog", () => {
    const str = genBlogString({
      title: TITLE,
      tags: TAGS,
      authors: AUTHORS,
      body: BLOG,
    });
    expect(str.endsWith(str)).toBe(true);
    const blocks = str.split("---");
    expect(blocks.length).toBe(3);
    expect(blocks[1].includes(TITLE)).toBe(true);
    expect(blocks[2].includes(`# ${TITLE}`)).toBe(true);
    expect(blocks[1].includes(TAGS.join(","))).toBe(true);
    expect(blocks[1].includes(AUTHORS)).toBe(true);
  });
});
