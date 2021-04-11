const commander = require('commander');
var chalk = require('chalk');
const fs = require("fs");
const download = require("download-git-repo");
const ora = require("ora");
const handlebars = require("handlebars");
const symbols = require("log-symbols");
const inquirer = require('inquirer');


const packageJson = require('./package.json');

let projectName;

commander.version(packageJson.version,'-v,--version')
    .command('init <name>')
    .action(name => {
        if (fs.existsSync(name)) {
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red("项目已存在"));
            return;
        }
        inquirer.prompt([
            {
                name: "description",
                message: "请输入项目描述"
            },
            {
                name: "author",
                message: "请输入作者名称"
            },
            {
                name: 'template',
                message: '请输入模板类型（pc/app）：'
            }
        ]).then(answers => {
            const spinner = ora('正在下载模板...');
            spinner.start();
            let TEMPLATE = "";
            switch(answers.template){
                case "app":
                    TEMPLATE = "https://github.com/WC836433345/react-pc.git";
                    break;
                case "app-apges":
                    TEMPLATE = "https://github.com/WC836433345/react-pc.git";
                    break;
                case "pc":
                    TEMPLATE = "https://github.com/WC836433345/react-pc.git";
                    break;
                case "pc-pages":
                    TEMPLATE = "https://github.com/WC836433345/react-pc.git";
                    break;
                default:
                    TEMPLATE = "https://github.com/WC836433345/react-pc.git";
                    break;
            }
            download(
                TEMPLATE,
                name,
                { clone: true },
                err => {
                    if (!err) {
                        spinner.succeed();
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        };
                        const fileName = `${name}/package.json`;
                        if (fs.existsSync(fileName)) {
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
                        }
                        console.log(symbols.success, chalk.green("项目初始化完成"));
                    } else {
                        spinner.fail();
                        console.log(symbols.error, chalk.red(`拉取远程仓库失败${err}`));
                    };
                }
            );
        });
    })
    .parse(process.argv);