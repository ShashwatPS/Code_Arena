export abstract class BaseProblemDefinitionGenerator {
    problemName: string = "";
    functionName: string = "";
    inputFields: { name: string; type: string }[] = [];
    outputFields: { name: string; type: string }[] = [];

    abstract parse(input: string): void;
    abstract generateCpp(): string ;
    abstract generateJava(): string ;
    abstract generatePython(): string ;
    abstract generateJavascript(): string ;
    abstract generateRust(): string ;
    abstract generateC(): string ;


    protected extractProblemName(line: string): string {
        const match = line.match(/: "(.*)"$/);
        return match ? match[1] : "";
    }

    protected extractFunctionName(line: string): string {
        const match = line.match(/: "(.*)"$/);
        return match ? match[1] : "";
    }

    protected extractField(line: string): { type: string; name: string } | null {
        const match = line.match(/Field: (\w+(?:<\w+>)?) (\w+)$/);
        return match ? { type: match[1], name: match[2] } : null;
    }

    protected mapTypeToJava(type:string):string {
        switch (type) {
            case "int":
                return "int";
            case "float":
                return "float";
            case "string":
                return "String";
            case "bool":
                return "boolean";
            case "list<int>":
                return "List<Integer>";
            case "list<float>":
                return "List<Float>";
            case "list<string>":
                return "List<String>";
            case "list<bool>":
                return "List<Boolean>";
            default:
                return "unknown";
        }
    }

    protected mapTypeToPython(type:string):string {
        switch (type) {
            case "int":
                return "int";
            case "float":
                return "float";
            case "string":
                return "str";
            case "bool":
                return "bool";
            case "list<int>":
                return "List[int]";
            case "list<float>":
                return "List[float]";
            case "list<string>":
                return "List[str]";
            case "list<bool>":
                return "List[bool]";
            default:
                return "unknown";
        }
    }

    protected mapTypeToCpp(type:string):string {
        switch (type) {
            case "int":
                return "int";
            case "float":
                return "float";
            case "string":
                return "string";
            case "bool":
                return "bool";
            case "list<int>":
                return "vector<int>";
            case "list<float>":
                return "vector<float>";
            case "list<string>":
                return "vector<string>";
            case "list<bool>":
                return "vector<bool>";
            default:
                return "unknown";
        }
    }

    protected mapTypeToJavascript(type:string):string {
        switch (type) {
            case "int":
                return "number";
            case "float":
                return "number";
            case "string":
                return "string";
            case "bool":
                return "boolean";
            case "list<int>":
                return "number[]";
            case "list<float>":
                return "number[]";
            case "list<string>":
                return "string[]";
            case "list<bool>":
                return "boolean[]";
            default:
                return "unknown";
        }
    }

    protected mapTypeToRust(type:string):string {
        switch (type) {
            case "int":
                return "i32";
            case "float":
                return "f32";
            case "string":
                return "String";
            case "bool":
                return "bool";
            case "list<int>":
                return "Vec<i32>";
            case "list<float>":
                return "Vec<f32>";
            case "list<string>":
                return "Vec<String>";
            case "list<bool>":
                return "Vec<bool>";
            default:
                return "unknown";
        }
    }

    protected mapTypeToC (type:string):string {
        switch (type) {
            case "int":
                return "int";
            case "float":
                return "float";
            case "string":
                return "char*";
            case "bool":
                return "bool";
            case "list<int>":
                return "int[]";
            case "list<float>":
                return "float[]";
            case "list<string>":
                return "char*[]";
            case "list<bool>":
                return "bool[]";
            default:
                return "unknown";
        }
    }
}
