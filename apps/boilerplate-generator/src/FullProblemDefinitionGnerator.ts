import { BaseProblemDefinitionGenerator } from './BaseProblemDefinitionGenerator';

export class FullProblemDefinitionGenerator extends BaseProblemDefinitionGenerator {

    parse(input: string): void {;
        const lines = input.split("\n").map((line) => line.trim());
        let currentSection: string | null = null;

        lines.forEach((line) => {
            if (line.startsWith("Problem Name:")) {
                this.problemName = this.extractProblemName(line);
            } else if (line.startsWith("Function Name:")) {
                this.functionName = this.extractProblemName(line);
            } else if (line.startsWith("Input Structure:")) {
                currentSection = "input";
            } else if (line.startsWith("Output Structure:")) {
                currentSection = "output";
            } else if (line.startsWith("Input Field") && currentSection === "input") {
                const field = this.extractField(line);
                if (field) this.inputFields.push(field);
            } else if (line.startsWith("Output Field") && currentSection === "output") {
                const field = this.extractField(line);
                if (field) this.outputFields.push(field);
            }
        });
    }

    generateCpp(): string {
        const inputReads = this.inputFields
            .map((field, index) => {
                if (field.type.startsWith("list<")) {
                    return `int size_${field.name};\n  std::istringstream(lines[${index}]) >> size_${field.name};\n  ${this.mapTypeToCpp(field.type)} ${field.name}(size_${field.name});\n  if(!size_${field.name}==0) {\n  \tstd::istringstream iss(lines[${index + 1}]);\n  \tfor (int i=0; i < size_arr; i++) iss >> arr[i];\n  }`;
                } else {
                    return `${this.mapTypeToCpp(field.type)} ${field.name};\n  std::istringstream(lines[${index}]) >> ${field.name};`;
                }
            })
            .join("\n  ");
        const outputType = this.outputFields[0].type;
        const functionCall = `${outputType} result = ${this.functionName}(${this.inputFields.map((field) => field.name).join(", ")});`;
        const outputWrite = `std::cout << result << std::endl;`;

        return `#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <climits>

##USER_CODE_HERE##

int main() {
  std::ifstream file("/dev/problems/${this.problemName.toLowerCase().replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt");
  std::vector<std::string> lines;
  std::string line;
  while (std::getline(file, line)) lines.push_back(line);

  file.close();
  ${inputReads}
  ${functionCall}
  ${outputWrite}
  return 0;
}
`;
    }

    generateJava(): string {
        let inputReadIndex = 0;
        const inputReads = this.inputFields
            .map((field , index)=>{
                if(field.type.startsWith("list<")){
                    let javaType = this.mapTypeToJava(field.type);
                    let inputType = javaType.match(/<(.*?)>/);
                    javaType = inputType ? inputType[1] : 'Integer';
                    let parseToType = (javaType === 'Integer') ? 'Int' : javaType;

                    return `int size_${field.name} = Integer.parseInt(lines.get(${inputReadIndex++}).trim());\n
        ${this.mapTypeToJava(field.type)} ${field.name} = new ArrayList<>(size_${field.name});\n
        String[] inputStream = lines.get(${inputReadIndex++}).trim().split("\\s+");\n
        for (String inputChar : inputStream)  {\n
          ${field.name}.add(${javaType}.parse${parseToType}(inputChar));\n
        }\n`;
                } else {
                    let javaType = this.mapTypeToJava(field.type);
                    if(javaType === 'int'){
                        javaType = 'Integer';
                    }
                    else if(javaType === 'float'){
                        javaType = 'Float';
                    }
                    else if(javaType === 'boolean'){
                        javaType = 'Boolean';
                    }else if(javaType === 'String'){
                        javaType = 'String';
                    }
                    let parseToType = (javaType === 'Integer') ? 'Int' : javaType;
                    return `${this.mapTypeToJava(field.type)} ${field.name} = ${javaType}.parse${parseToType}(lines.get(${inputReadIndex++}).trim());`;
                }
            }).join("\n  ");
        const outputType = this.mapTypeToJava(this.outputFields[0].type);
        const functionCall = `${outputType} result = ${this.functionName}(${this.inputFields.map((field) => field.name).join(", ")});`;
        const outputWrite = `System.out.println(result);`;

        return `
import java.io.*;
import java.util.*;

public class Main {
    
    ##USER_CODE_HERE##

    public static void main(String[] args) {
        String filePath = "/dev/problems/${this.problemName.toLowerCase().replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt"; 
        List<String> lines = readLinesFromFile(filePath);
        ${inputReads}
        ${functionCall}
        ${outputWrite}
    }
    public static List<String> readLinesFromFile(String filePath) {
        List<String> lines = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                lines.add(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return lines;
    }
}`
    }

    generateJavascript(): string {
        const inputs = this.inputFields.map((field) => field.name).join(", ");
        const inputReads = this.inputFields
            .map((field) => {
                if (field.type.startsWith("list<")) {
                    return `const size_${field.name} = parseInt(input.shift());\nconst ${field.name} = input.splice(0, size_${field.name}).map(Number);`;
                } else {
                    return `const ${field.name} = parseInt(input.shift());`;
                }
            })
            .join("\n  ");
        const outputType = this.outputFields[0].type;
        const functionCall = `const result = ${this.functionName}(${this.inputFields.map((field) => field.name).join(", ")});`;
        const outputWrite = `console.log(result);`;

        return `##USER_CODE_HERE##

const input = require('fs').readFileSync('/dev/problems/${this.problemName.toLowerCase().replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\\n').join(' ').split(' ');
${inputReads}
${functionCall}
${outputWrite}
    `;
    }

    generateRust(): string {
        const inputs = this.inputFields
            .map((field) => `${field.name}: ${this.mapTypeToRust(field.type)}`)
            .join(", ");
        const inputReads = this.inputFields
            .map((field) => {
                if (field.type.startsWith("list<")) {
                    return `let size_${field.name}: usize = lines.next().and_then(|line| line.parse().ok()).unwrap_or(0);\n\tlet ${field.name}: ${this.mapTypeToRust(field.type)} = parse_input(lines, size_${field.name});`;
                } else {
                    return `let ${field.name}: ${this.mapTypeToRust(field.type)} = lines.next().unwrap().parse().unwrap();`;
                }
            })
            .join("\n  ");
        const containsVector = this.inputFields.find((field) =>
            field.type.startsWith("list<")
        );
        const outputType = this.mapTypeToRust(this.outputFields[0].type);
        const functionCall = `let result = ${this.functionName}(${this.inputFields.map((field) => field.name).join(", ")});`;
        const outputWrite = `println!("{}", result);`;

        return `use std::fs::read_to_string;
use std::io::{self};
use std::str::Lines;

##USER_CODE_HERE##

fn main() -> io::Result<()> {
  let input = read_to_string("/dev/problems/${this.problemName.toLowerCase().replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt")?;
  let mut lines = input.lines();
  ${inputReads}
  ${functionCall}
  ${outputWrite}
  Ok(())
}${
            containsVector
                ? `\nfn parse_input(mut input: Lines, size_arr: usize) -> Vec<i32> {
    let arr: Vec<i32> = input
        .next()
        .unwrap_or_default()
        .split_whitespace()
        .filter_map(|x| x.parse().ok())
        .collect();

    if size_arr == 0 {
        Vec::new()
    } else {
        arr
    }
}`
                : ""
        }
`;
    }

    generateC(): string {
        const inputReads = this.inputFields
            .map((field, index) => {
                if (field.type.startsWith("list<")) {
                    return `int size_${field.name};\n  scanf("%d", &size_${field.name});\n  ${this.mapTypeToC(field.type)} ${field.name}[size_${field.name}];\n  for (int i = 0; i < size_${field.name}; i++) scanf("%${this.mapTypeToC(field.type)}", &${field.name}[i]);`;
                } else {
                    return `${this.mapTypeToC(field.type)} ${field.name};\n  scanf("%${this.mapTypeToC(field.type)}", &${field.name});`;
                }
            })
            .join("\n  ");

        const outputType = this.mapTypeToC(this.outputFields[0].type);
        const functionCall = `${outputType} result = ${this.functionName}(${this.inputFields.map((field) => field.name).join(", ")});`;
        const outputWrite = `printf("%${this.mapTypeToC(this.outputFields[0].type)}\\n", result);`;

        return `#include <stdio.h>
#include <stdlib.h>

##USER_CODE_HERE##

int main() {
    ${inputReads}
    ${functionCall}
    ${outputWrite}
    return 0;
}
`;
    }

    generatePython(): string {
        const inputReads = this.inputFields
            .map((field, index) => {
                if (field.type.startsWith("list<")) {
                    return `size_${field.name} = int(input().strip())\n${field.name} = list(map(int, input().strip().split()))[:size_${field.name}]`;
                } else {
                    return `${field.name} = ${this.mapTypeToPython(field.type)}(input().strip())`;
                }
            })
            .join("\n  ");

        const outputType = this.mapTypeToPython(this.outputFields[0].type);
        const functionCall = `result = ${this.functionName}(${this.inputFields.map((field) => field.name).join(", ")})`;
        const outputWrite = `print(result)`;

        return `##USER_CODE_HERE##

if __name__ == "__main__":
    ${inputReads}
    ${functionCall}
    ${outputWrite}
`;
    }
}
