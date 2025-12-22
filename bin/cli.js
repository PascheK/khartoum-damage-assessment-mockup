#!/usr/bin/env node
import { execSync } from 'node:child_process';

const runCommand = command => {
  try{
    execSync(`${command}`, { stdio: 'inherit' } );
  }
  catch(e) {
    console.error(`failed to execute command : ${command}`,e);
    return false;
  }
  return true;
}

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/PSC-IMAT/create-unops-starter ${repoName}`
const installDepsCommand = `cd ${repoName} && npm install`

console.log(`Creating a new UNOPS Starter project in ./${repoName}\n`);

const checkOut = runCommand(gitCheckoutCommand);
if(!checkOut) process.exit(1);
  console.log(`Installing dependencies for repo : ${repoName}\n`);
const installDeps = runCommand(installDepsCommand);

if(!installDeps) process.exit(1);
console.log(`Successfully created a new UNOPS Starter project in ./${repoName}\n Follow the follow commands to get started!`);
console.log(`cd ${repoName} && npm run dev`);