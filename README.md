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
gemini-clean gemini/suites --reference=gemini/references
```

## Example using config

```js
// .gemini-clean.js
module.exports = [
    {
        suites: ['gemini/images/desktop'],
        references: ['gemini/references/images/desktop'],
        globals: {
            platform: 'desktop'
        }
    },
    {
        suites: ['gemini/video/desktop'],
        references: ['gemini/references/video/desktop'],
        globals: {
            platform: 'desktop'
        }
    }
]
```
```bash
gemini-clean
```
