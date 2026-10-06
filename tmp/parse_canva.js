const fs = require('fs');
const content = fs.readFileSync('/tmp/script_4.js', 'utf8');

const startIdx = content.indexOf("window['bootstrap'] = JSON.parse('");
if (startIdx !== -1) {
  const jsonStart = startIdx + "window['bootstrap'] = JSON.parse('".length;
  const jsonEnd = content.indexOf("');", jsonStart);
  const rawStr = content.slice(jsonStart, jsonEnd);
  
  // The string is a JS string literal containing JSON.
  // In JS, eval or Function can safely unpack the escaped string:
  const jsonStr = (new Function(`return '${rawStr}'`))();
  const data = JSON.parse(jsonStr);
  fs.writeFileSync('/tmp/bootstrap.json', JSON.stringify(data, null, 2));
  console.log('Successfully written /tmp/bootstrap.json! Size:', fs.statSync('/tmp/bootstrap.json').size);
  console.log('Top keys:', Object.keys(data));
} else {
  console.log('startIdx not found');
}
