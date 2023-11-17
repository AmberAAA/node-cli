import { Command } from "commander";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const program = new Command();

program.name("Blog 快速生成工具").version("0.0.1");

program
  .command("blog")
  .description("快速生成一片博客，并发布")
  .argument("<string>", "博客内容")
  .option("-t, --title <string>", "标题")
  .option("--tag <string>", "标签")
  .option("--authors <string>", "作者", "authors")
  .action((str, options) => {});

program.parse();
