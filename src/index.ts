#!/usr/bin/env node
import inquirer, { QuestionCollection } from "inquirer";
import { confirm, editor } from "@inquirer/prompts";
import { genBlogString } from "./blog.js";
import { exec } from "child_process";
import { writeFile } from "fs/promises";
import dayjs from "dayjs";
import { input } from "@inquirer/prompts";
const BLOG_ROOT = `${process.env.HOME}/code/docs`;
const BLOG_DIR = "/blog";

const runCmd = async (cmd: string) => {
  return new Promise<string>((res, rej) => {
    exec(cmd, (err, std) => {
      if (err) {
        return rej(err);
      }
      res(std);
    });
  });
};

interface BlogAnswers {
  title: string;
  authors: string;
  body: string;
  tags: string;
  filename: string;
}

const questions: QuestionCollection<BlogAnswers> = [
  {
    type: "input",
    name: "filename",
    message: "filename?",
  },
  {
    type: "input",
    name: "title",
    message: "title?",
  },
  {
    type: "input",
    name: "tags",
    message: "tags?",
  },
  {
    type: "editor",
    name: "body",
    message: "body?",
  },
];

async function main() {
  const day = dayjs();
  let tags = "";
  let title = "";
  let filename = "";
  let body = "";
  let flag = false;
  let state = false;

  while (!flag) {
    filename = await input({ message: "filename?", default: filename });
    title = await input({ message: "title?", default: title });
    tags = await input({ message: "tags?", default: tags });
    body = await editor({ message: "body?", default: body });
    console.log(
      genBlogString({ tags: tags.split(/,|，/), title, body, authors: "Amber" })
    );
    flag = await confirm({ message: "ok?", default: false });
  }

  // 清空git
  await runCmd(`cd ${BLOG_ROOT} && git pull`);
  // 创建文件
  await writeFile(
    `${BLOG_ROOT}/${BLOG_DIR}/${day.format("YYYY-MM-DD")}-${filename}.md`,
    genBlogString({ tags: tags.split(/,|，/), title, body, authors: "Amber" })
  );
  await runCmd(
    `cd ${BLOG_ROOT} && git add . && git commit -m "publish a blog" && git push`
  );
}

main();
