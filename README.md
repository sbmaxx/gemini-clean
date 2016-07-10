# gemini-clean
Find and remove reduntant gemini references without running actual tests ;)

P.S. Maybe the proper way to do this job — implement yet another mode in [gemini](https://github.com/gemini-testing/gemini) itself.
But let's check if this functionally is really needed someone else.

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
gemini-clean gemini/suites --reference=gemini/references
```

```
Unused:
  gemini/references/state
```
