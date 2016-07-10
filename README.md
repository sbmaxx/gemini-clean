# gemini-clean
Find and remove reduntant gemini references without running actual tests ;)

## Install
```bash
npm install gemini-clean
gemini-clean --help
```

## Example
```bash
git clone https://github.com/sbmaxx/gemini-clean.git
cd gemini-clean
npm install
gemini-clean example.js
```

```
root
root/parent
  plain
  hovered
  pressed
root/parent/child
  plain
  hovered
root/parent/child/grandChild
  plain
  pressed
```
