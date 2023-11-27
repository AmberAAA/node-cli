#!/usr/bin/env node

import dayjs from "dayjs";
import inquirer, { QuestionCollection } from "inquirer";
import { confirm, input, editor } from "@inquirer/prompts";
import { exec } from "child_process";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";

const BLOG_ROOT = `${process.env.HOME}/code/diary`;
const BLOG_DIR = "blog";

interface Diary {
  body: string;
}

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

const questions: QuestionCollection<Diary> = [
  {
    type: "editor",
    name: "body",
    message: "body?",
  },
];

export function genDiaryString({ body }: Diary) {
  const title = dayjs().format("YYYY年MM月DD日");
  return `---
title: ${title}
---

# ${title}

${body}
  `;
}

async function main() {
  const day = dayjs();
  const title = day.format("YYYY-MM-DD");
  const path = `${BLOG_ROOT}/${BLOG_DIR}/${title}.md`;
  let body = "";
  let state = false;
  try {
    const d = (await readFile(path)).toString();
    if (d) {
      const strs = d.split("\n");
      body = strs.slice(6, strs.length).join("\n");
      state = true;
    }
  } catch (e) {
    console.error(e);
  }

  let flag = false;

  while (!flag) {
    body = await editor({ default: body, message: "body?" });
    console.log(genDiaryString({ body }));
    flag = await confirm({ message: "isOk?", default: false });
  }

  // 清空git
  await runCmd(`cd ${BLOG_ROOT} && git pull`);

  await writeFile(
    `${BLOG_ROOT}/${BLOG_DIR}/${day.format("YYYY-MM-DD")}.md`,
    genDiaryString({ body })
  );
  await runCmd(
    `cd ${BLOG_ROOT} && git add . && git commit -m "${
      !state ? "add" : "modify"
    } ${title}" && git push`
  );
}

main();
