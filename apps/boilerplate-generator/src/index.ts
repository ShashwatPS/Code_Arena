import fs from 'fs';
import { ProblemDefinitionGenerator } from './ProblemDefinitionGenerator';
import { FullProblemDefinitionGenerator } from './FullProblemDefinitionGnerator';
import dotenv from 'dotenv';
import path from "path";
dotenv.config();

function generatePartialBoilerplate(generatorFilePath: string) {
    console.log("Generating boilerplate for ", generatorFilePath);
    const inputFilePath = path.join(generatorFilePath, "Structure.md");
    const boilerplatePath = path.join(
        generatorFilePath,
        "boilerplate"
    )
    const input = fs.readFileSync(inputFilePath, "utf-8");

    const parser = new ProblemDefinitionGenerator();
    parser.parse(input);

    const cppCode = parser.generateCpp();
    const jsCode = parser.generateJavascript();
    const cCode = parser.generateC();
    const rustCode = parser.generateRust();
    const javaCode = parser.generateJava();
    const pythonCode = parser.generatePython();

    if (!fs.existsSync(boilerplatePath)) {
        fs.mkdirSync(boilerplatePath, {recursive: true});
    }

    fs.writeFileSync(path.join(boilerplatePath, "function.cpp"), cppCode);
    fs.writeFileSync(path.join(boilerplatePath, "function.js"), jsCode);
    fs.writeFileSync(path.join(boilerplatePath, "function.rs"), rustCode);
    fs.writeFileSync(path.join(boilerplatePath, "function.java"), javaCode);
    fs.writeFileSync(path.join(boilerplatePath, "function.py"), pythonCode);
    fs.writeFileSync(path.join(boilerplatePath, "function.c"), cCode);

    console.log("Function Definition Generated Successfully");
}

function generateFullBoilerPlate(generatorFilePath: string){
    const inputFilePath = path.join(generatorFilePath, "Structure.md");
    const boilerplatePath = path.join(
        generatorFilePath,
        "boilerplate"
    )
    const input = fs.readFileSync(inputFilePath, "utf-8");

    const parser = new FullProblemDefinitionGenerator();
    parser.parse(input);

    const cppCode = parser.generateCpp();
    const jsCode = parser.generateJavascript();
    const cCode = parser.generateC();
    const rustCode = parser.generateRust();
    const javaCode = parser.generateJava();
    const pythonCode = parser.generatePython();

    if (!fs.existsSync(boilerplatePath)) {
        fs.mkdirSync(boilerplatePath, { recursive: true });
    }

    fs.writeFileSync(path.join(boilerplatePath, "function.cpp"), cppCode);
    fs.writeFileSync(path.join(boilerplatePath, "function.js"), jsCode);
    fs.writeFileSync(path.join(boilerplatePath, "function.rs"), rustCode);
    fs.writeFileSync(path.join(boilerplatePath, "function.java"), javaCode);
    fs.writeFileSync(path.join(boilerplatePath, "function.py"), pythonCode);
    fs.writeFileSync(path.join(boilerplatePath, "function.c"), cCode);

    console.log("Function Definition Generated Successfully");
}

const getFolders = (dir: string) => {
    return new Promise((resolve,reject)=>{
        fs.readdir(dir, (err, files) => {
            if(err) reject(err);

            const folders : string[] = [];
            console.log(files);
            let pending = files.length;

            if(!pending) return resolve(folders);

            files.forEach((file)=>{
                const filePath = path.join(dir, file);
                fs.stat(filePath, (err, stat)=>{
                    if(err) reject(err);
                    if(stat.isDirectory()){
                        folders.push(filePath);
                    }
                    if (!--pending) resolve(folders);
                })
            })
        });
    })
}

async function generateBoilerplatesForFolder(folderPath: string) {
    generatePartialBoilerplate(folderPath);
    generateFullBoilerPlate(folderPath);
}

async function main() {
    const problemsDirPath = process.env.PROBLEMS_DIR_PATH;
    if (!problemsDirPath) {
        console.log("Store a valid problems dir path in .env", problemsDirPath);
        return;
    }
    try {
        const folders: any = await getFolders(path.join(__dirname, problemsDirPath));
        for (const folder of folders) {
            const folderPath = folder;
            console.log({"path":folderPath});
            await generateBoilerplatesForFolder(folderPath);
        }
    } catch (err) {
        console.error("Error reading or processing folders:", err);
    }
}

main();