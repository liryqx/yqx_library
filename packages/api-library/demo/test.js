import { generate } from 'openapi-typescript';

generate({
    input: 'source/swagger.yaml', // 指定OpenAPI协议文档文件路径
    output: {
        '.ts': {
            useFullNameInClasses: true, // 使用完整的命名空间在类中
            useOriginalNameInInterfaces: true // 使用原始名称在接口中
        }
    }
}).then(({ classes, interfaces }) => {
    // 在这里可以使用生成的类和接口定义文件
    console.log(classes);
    console.log(interfaces);
});