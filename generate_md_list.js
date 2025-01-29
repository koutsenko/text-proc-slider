const fs = require('fs');
const path = require('path');

// Функция для рекурсивного обхода директорий
function walkDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            walkDir(filePath, fileList);
        } else if (path.extname(file) === '.md') {
            fileList.push({
                path: filePath,
                size: stat.size
            });
        }
    });

    return fileList;
}

// Функция для создания HTML файла
function createHTML(fileList) {
    const sortedList = fileList.sort((a, b) => b.size - a.size);

    let html = `<html>
<head>
    <title>MD Files List</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
    </style>
</head>
<body>
    <h1>MD Files List</h1>
    <table>
        <tr>
            <th>Path</th>
            <th>Size (bytes)</th>
        </tr>`;

    sortedList.forEach(file => {
        html += `
        <tr>
            <td>${file.path}</td>
            <td>${file.size}</td>
        </tr>`;
    });

    html += `
    </table>
</body>
</html>`;

    fs.writeFileSync('md_files.html', html);
}

// Основная функция
function main() {
    const currentDir = process.cwd();
    const mdFiles = walkDir(currentDir);
    createHTML(mdFiles);
    console.log('HTML file created successfully!');
}

main();