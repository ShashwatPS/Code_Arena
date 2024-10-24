import { BaseProblemDefinitionGenerator } from './BaseProblemDefinitionGenerator';

export class ProblemDefinitionGenerator extends BaseProblemDefinitionGenerator {

    parse(input: string): void {
        const lines = input.split("\n").map((line) => line.trim());
        let currentSection: string | null = null;

        lines.forEach((line) => {
            if (line.startsWith("Problem Name:")) {
                this.problemName = this.extractProblemName(line);
            } else if (line.startsWith("Function Name:")) {
                this.functionName = this.extractFunctionName(line);
            } else if(line.startsWith("Input Structure:")){
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
        const inputs = this.inputFields
            .map((field) => `${this.mapTypeToCpp(field.type)} ${field.name}`)
            .join(", ");
        return `${this.mapTypeToCpp(this.outputFields[0].type)} ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    }

    generateJava(): string {
        const inputs = this.inputFields
            .map((field) => `${this.mapTypeToJava(field.type)} ${field.name}`)
            .join(", ");
        return `public ${this.mapTypeToJava(this.outputFields[0].type)} ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    }

    generatePython(): string {
        const inputs = this.inputFields
            .map((field) => `${this.mapTypeToPython(field.type)} ${field.name}`)
            .join(", ");
        return `def ${this.functionName}(${inputs}):\n    # Implementation goes here\n    return result`;
    }

    generateJavascript(): string {
        const inputs = this.inputFields
            .map((field) => `${this.mapTypeToJavascript(field.type)} ${field.name}`)
            .join(", ");
        return `function ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    }

    generateRust(): string {
        const inputs = this.inputFields
            .map((field) => `${this.mapTypeToRust(field.type)} ${field.name}`)
            .join(", ");
        return `fn ${this.functionName}(${inputs}) -> ${this.mapTypeToRust(this.outputFields[0].type)} {\n    // Implementation goes here\n    result\n}`;
    }

    generateC(): string {
        const inputs = this.inputFields
            .map((field) => `${this.mapTypeToC(field.type)} ${field.name}`)
            .join(", ");
        return `${this.mapTypeToC(this.outputFields[0].type)} ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    }

}
