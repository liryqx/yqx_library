import * as fs from 'fs';
import * as path from 'path';

// 读取 OpenAPI JSON 文件
const openApiJsonFile = path.resolve(__dirname, 'source/openapi.json');
const openApiJson = JSON.parse(fs.readFileSync(openApiJsonFile, 'utf-8'));

// 解析 OpenAPI JSON 文件
const interfaces: string[] = [];

for (const schemaName in openApiJson.components.schemas) {
    const schema = openApiJson.components.schemas[schemaName];
    if (schema.type === 'object') {
        let interfaceStr = `export interface ${schemaName} {\n`;
        for (const propName in schema.properties) {
            const prop = schema.properties[propName];
            interfaceStr += `  ${propName}: ${parseType(prop)};\n`;
        }
        interfaceStr += '}';
        interfaces.push(interfaceStr);
    }
}

// 将 TypeScript 接口写入文件
const outputFile = path.resolve(__dirname, 'source/interfaces.ts');
fs.writeFileSync(outputFile, interfaces.join('\n\n'));

// 解析 OpenAPI 类型到 TypeScript 类型的辅助函数
function parseType(prop: any): string {
    switch (prop.type) {
        case 'string':
            return 'string';
        case 'number':
        case 'integer':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'array':
            return `${parseType(prop.items)}[]`;
        case 'object':
            if (prop.additionalProperties) {
                return `{ [key: string]: ${parseType(prop.additionalProperties)} }`;
            } else {
                return 'any';
            }
        default:
            if (prop.$ref) {
                return prop.$ref.split('/').pop();
            } else {
                return 'any';
            }
    }
}
