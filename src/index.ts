import { Command } from "commander";

const program = new Command();

program.name("Blog 快速生成工具").version("0.0.1");

program
  .command("blog")
  .description("快速生成一片博客，并发布")
  .argument("<string>", "博客内容")
  .option("-t, --title <string>", "标题")
  .option("--tag <string>", "标签")
  .option("--authors <string>", "作者", "authors")
  .action((str, options) => {
    console.log(
      genBlog(str, {
        title: options.title ?? "未命名标题",
        tags: options.tag ?? "",
        authors: options.authors,
      })
    );
  });

program.parse();

export function genBlog(
  body: string,
  config: { title: string; tags?: string; authors: string }
) {
  return `---
title: ${config.title}
tags: [${config.tags ?? ""}]
authors: ${config.authors}
---

# ${config.title}

${body}
  `;
}
