const fs = require("fs")
const { XMLParser, XMLBuilder } = require("fast-xml-parser")

const perser = new XMLParser()
const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
})

const extractWords = []

// 抽出対象の文字を取得
for (let i = 3; i < process.argv.length; i++) {
    extractWords.push(process.argv[i])
}

console.log(extractWords)

// 元ファイル読み込み
const filePath = process.argv[2]
const xml = fs.readFileSync(filePath)

// xmlパース 抽出
const xmlObj = perser.parse(xml)
const outWordArray = []

xmlObj.Words.Part.forEach(part => {
    part.Word.forEach(word => {
        // 抽出対象の文字を含んでいるか判定
        let count = 0
        extractWords.forEach(extractWord => {
            if (word.Characters.includes(extractWord)) {
                count++
            }
        })
        if (count > 0) {
            console.log(word.Characters)
            outWordArray.push(word)
        }
    })
})

console.log(outWordArray)

// xml組み立て
const outObj = { Words: {}}
outObj["Words"]["Name"] = xmlObj.Words.Name + " - Parsed"
outObj["Words"]["Author"] = ""
outObj["Words"]["Language"] = xmlObj.Words.Language
outObj["Words"]["Signature"] = Math.floor(Math.random()*10000)
outObj["Words"]["Memo"] = "Extracted by wt-word-extractor"
outObj["Words"]["Part"] = [ { Word: outWordArray} ]

const outXml = builder.build(outObj)

// BOM付で保存
fs.writeFileSync("./output.xml", "\ufeff" + outXml)