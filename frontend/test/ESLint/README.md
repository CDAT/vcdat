# ESLint

[ESLint][1] is a [Javascript linting tool][2] . It assesses our code to ensure that it both conforms to
our code style, and is free of typical Javascript developer faux pas.
This helps us to maintain code quality by preventing certain types of bugs before they happen, and by keeping the code
clean and easy on the eyes of our dev team.

## Configuration

We configure our linter with .eslintrc.json files. The frontend/ directory contains the 'root' configuration file.
Each sub-directory can contain its own .eslintrc.json file, if we want to leverage the [configuration cascading][3]
feature of ESLint. This lets us universally apply the 'root' configuration, while allowing for directory-specific
configurations that can override 'root', when necessary.
I will touch briefly on basic configuration options below. If you want to learn more, you can check out ESLint's
[guide][4].

### Adding rules

To add individual rules to .eslintrc.json, we merely have to add a "rules" object. This object contains the rule we want
to activate, and any options that may go with that rule.
```javascript
{
    "rules": {
        "max-len": ["error", 120, 4], // If a line is >120 characters long, error. Count \t characters as 4 spaces.
        "spaced-comment": ["error", "always"] // Error if a comment does not have a space before its text.
    }
}
```
There is a huge set of [rules included in ESLint][5], and there are [many npm packages][6] that expand the rule set.

### Using predefined rules sets

If you don't want to go through the pain of searching for and applying individual rules, you can make your configuration
[extend][7] a pre-defined rule set.
```javascript
{
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "rules":{
        // Your rules here
    }
}
```


[1]: http://eslint.org/

[2]: http://mikecavaliere.com/javascript-linting-what-developers-need-to-know/

[3]: http://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy

[4]: http://eslint.org/docs/user-guide/configuring

[5]: http://eslint.org/docs/rules/

[6]: https://www.npmjs.com/search?q=eslint-config-*

[7]: http://eslint.org/docs/user-guide/configuring#extending-configuration-files
