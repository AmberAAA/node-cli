#!/usr/bin/env node

import dayjs from "dayjs";
import inquirer, { QuestionCollection } from "inquirer";
import { confirm } from "@inquirer/prompts";
import { exec } from "child_process";
import { writeFile } from "fs/promises";

const BLOG_ROOT = `${process.env.HOME}/code/diary`;
const BLOG_DIR = "/blog";

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
  const title = dayjs().format("YYYY-MM-DD");
  return `---
title: ${title}
---

# ${title}

${body}
  `;
}

async function main() {
  const day = dayjs();

  const answer = await inquirer.prompt(questions);
  const str = genDiaryString({
    body: answer.body,
  });
  console.log(str);
  const c = await confirm({ message: "isOK?" });
  if (!c) return;
  // 清空git
  await runCmd(`cd ${BLOG_ROOT} && git pull`);
  // 创建文件
  await writeFile(
    `${BLOG_ROOT}/${BLOG_DIR}/${day.format("YYYY-MM-DD")}.md`,
    str
  );
  await runCmd(
    `cd ${BLOG_ROOT} && git add . && git commit -m "publish a diary" && git push`
  );
}

main();
