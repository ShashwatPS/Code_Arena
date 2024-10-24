import fs from 'fs';
import { ProblemDefinitionGenerator } from './ProblemDefinitionGenerator';
import { FullProblemDefinitionGenerator } from './FullProblemDefinitionGnerator';
import dotenv from 'dotenv';
import path from "path";
dotenv.config();

function generatePartialBoilerplate(generatorFilePath: string) {
    const inputFilePath = path.join(generatorFilePath, "Structure.md");
    const boilerplate = path.join(
        generatorFilePath,
        "boilerplate"
    )

}
